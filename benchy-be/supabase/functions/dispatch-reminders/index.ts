/// <reference path="../edge-runtime.d.ts" />
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type TemplateId = 'sitNudge' | 'streakSoft' | 'nearbyBench' | 'messageHeart';
type Provider = 'expo' | 'fcm' | 'apns';

type TokenRow = {
  user_id: string;
  provider: Provider;
  token: string;
  locale: string | null;
  enabled: boolean;
};

const TEMPLATES: Record<TemplateId, Record<'pl' | 'en', { title: string; body: string }>> = {
  sitNudge: {
    pl: {
      title: 'Ławka pamięta',
      body: 'Dawno Cię nie było. Placeholder na łagodne przypomnienie.',
    },
    en: {
      title: 'The bench remembers',
      body: 'It has been a while. Placeholder for a gentle nudge.',
    },
  },
  streakSoft: {
    pl: {
      title: 'Seria stygnie',
      body: 'Jeszcze zdążysz usiąść. Placeholder.',
    },
    en: {
      title: 'The streak is cooling',
      body: 'There is still time to sit. Placeholder.',
    },
  },
  nearbyBench: {
    pl: {
      title: 'Wolna ławka',
      body: 'Gdzieś blisko stoi ławka. Placeholder.',
    },
    en: {
      title: 'A free bench',
      body: 'A bench is standing somewhere nearby. Placeholder.',
    },
  },
  messageHeart: {
    pl: {
      title: 'Ktoś docenił wiadomość',
      body: 'Twoja wiadomość dostała serduszko. Placeholder.',
    },
    en: {
      title: 'Someone liked your message',
      body: 'Your bench message got a heart. Placeholder.',
    },
  },
};

const QUIET_HOURS = 20;
const SIT_GAP_DAYS = 3;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function isServiceRole(request: Request): boolean {
  const header = request.headers.get('Authorization') ?? '';
  const token = header.replace(/^Bearer\s+/i, '');
  const payload = token.split('.')[1];
  if (!payload) return false;
  try {
    const claims = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return claims.role === 'service_role';
  } catch {
    return false;
  }
}

function localeOf(value: string | null): 'pl' | 'en' {
  return value === 'en' ? 'en' : 'pl';
}

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

function chooseTemplate(
  streak: number,
  lastLoginDate: string | null,
  satRecently: boolean
): TemplateId | null {
  if (lastLoginDate === todayUtc()) return null;
  if (streak >= 2) return 'streakSoft';
  if (!satRecently) return 'sitNudge';
  return null;
}

async function sendExpo(token: string, title: string, body: string, templateId: TemplateId) {
  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      to: token,
      title,
      body,
      data: { templateId },
    }),
  });

  const payload = await response.json();
  const ticket = payload?.data;
  if (ticket?.status === 'error' && ticket?.details?.error === 'DeviceNotRegistered') {
    return 'gone' as const;
  }
  if (!response.ok || ticket?.status === 'error') {
    return 'error' as const;
  }
  return 'ok' as const;
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return json({ ok: true });
  if (request.method !== 'POST') return json({ error: 'method' }, 405);
  if (!isServiceRole(request)) return json({ error: 'forbidden' }, 403);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceKey) return json({ error: 'missing_env' }, 500);

  const supabase = createClient(supabaseUrl, serviceKey);
  const body = await request.json().catch(() => ({}));
  const forcedUserId = typeof body.userId === 'string' ? body.userId : null;
  const forcedTemplate = TEMPLATES[body.templateId as TemplateId] ? (body.templateId as TemplateId) : null;
  const force = body.force === true;

  let tokenQuery = supabase
    .from('user_push_tokens')
    .select('user_id, provider, token, locale, enabled')
    .eq('enabled', true);
  if (forcedUserId) tokenQuery = tokenQuery.eq('user_id', forcedUserId);

  const { data: tokenRows, error: tokenError } = await tokenQuery;
  if (tokenError) return json({ error: tokenError.message }, 500);

  const tokens = (tokenRows ?? []) as TokenRow[];
  const userIds = [...new Set(tokens.map((row) => row.user_id))];
  if (userIds.length === 0) return json({ sent: 0, skipped: 0 });

  const quietSince = new Date(Date.now() - QUIET_HOURS * 60 * 60 * 1000).toISOString();
  const sitSince = new Date(Date.now() - SIT_GAP_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const [{ data: profiles }, { data: sits }, { data: recentDispatches }] = await Promise.all([
    supabase
      .from('user_profiles')
      .select('user_id, current_streak, last_login_date')
      .in('user_id', userIds),
    supabase.from('sit_sessions').select('user_id').in('user_id', userIds).gte('created_at', sitSince),
    supabase
      .from('notification_dispatches')
      .select('user_id')
      .in('user_id', userIds)
      .gte('sent_at', quietSince),
  ]);

  const profileByUser = new Map(
    ((profiles ?? []) as { user_id: string; current_streak: number | null; last_login_date: string | null }[]).map(
      (profile) => [profile.user_id, profile]
    )
  );
  const satRecently = new Set(((sits ?? []) as { user_id: string }[]).map((row) => row.user_id));
  const alreadySent = new Set(((recentDispatches ?? []) as { user_id: string }[]).map((row) => row.user_id));

  let sent = 0;
  let skipped = 0;
  let nativeSkipped = 0;

  for (const userId of userIds) {
    if (!force && alreadySent.has(userId)) {
      skipped += 1;
      continue;
    }

    const profile = profileByUser.get(userId);
    const templateId =
      forcedTemplate ??
      chooseTemplate(profile?.current_streak ?? 0, profile?.last_login_date ?? null, satRecently.has(userId));

    if (!templateId) {
      skipped += 1;
      continue;
    }

    const userTokens = tokens.filter((row) => row.user_id === userId);
    const locale = localeOf(userTokens.find((row) => row.locale)?.locale ?? null);
    const message = TEMPLATES[templateId][locale];
    let delivered = false;

    for (const row of userTokens) {
      if (row.provider !== 'expo') {
        nativeSkipped += 1;
        continue;
      }

      const result = await sendExpo(row.token, message.title, message.body, templateId);
      if (result === 'gone') {
        await supabase
          .from('user_push_tokens')
          .update({ enabled: false })
          .eq('user_id', userId)
          .eq('token', row.token);
        continue;
      }
      if (result === 'ok') delivered = true;
    }

    if (!delivered) {
      skipped += 1;
      continue;
    }

    await supabase.from('notification_dispatches').insert({ user_id: userId, template_id: templateId });
    sent += 1;
  }

  return json({ sent, skipped, nativeSkipped });
});
