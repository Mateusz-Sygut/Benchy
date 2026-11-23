/// <reference path="../edge-runtime.d.ts" />
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type TemplateId = 'sitNudge' | 'messageNudge' | 'streakSoft';
type Provider = 'expo' | 'fcm' | 'apns';

type TokenRow = {
  user_id: string;
  provider: Provider;
  token: string;
  locale: string | null;
  enabled: boolean;
};

const TEMPLATES: Record<TemplateId, Record<'pl' | 'en', { title: string; bodies: string[] }>> = {
  sitNudge: {
    pl: {
      title: 'Usiądź na chwilę',
      bodies: [
        'Pamiętaj, że nie zawsze trzeba się spieszyć! Może warto usiąść na chwilę i odetchnąć?',
        'Podróż w nieznane? Czasem wystarczy tylko zboczyć z utartej ścieżki. Może uda się znaleźć miejsce warte przycupnięcia na moment?',
        'Intrygujące miejsca mogą czaić się za każdym rogiem. Może by tak wyjść na spacer i odkryć kilka z nich?',
        'Medytacja może przybierać różne formy. Zachwyt nad pięknym widokiem, siedząc na ławeczce to jedna z nich.',
        'Po co siedzieć w domu, skoro można posiedzieć na świeżym powietrzu?',
        'Twoje ulubione miejsca mogą kryć wiele historii. Każdy przechodzień mógł zostawić tam coś po sobie. Pora to odkryć!',
      ],
    },
    en: {
      title: 'Sit for a moment',
      bodies: [
        'You do not always have to rush. Maybe it is worth sitting down for a moment and catching your breath.',
        'A trip into the unknown? Sometimes it is enough to step off the beaten path. You might find a place worth settling into for a moment.',
        'Intriguing places can be waiting around every corner. How about a walk to discover a few of them?',
        'Meditation can take many forms. Wonder at a beautiful view while sitting on a bench is one of them.',
        'Why sit at home when you can sit out in the fresh air?',
        'Your favorite places can hide many stories. Any passer-by might have left something there. Time to find it.',
      ],
    },
  },
  messageNudge: {
    pl: {
      title: 'Zostaw wiadomość',
      bodies: [
        'Każdy może postrzegać świat inaczej. Usiądź i opisz, co widzisz, pozwól dostrzec to innym.',
        'Może nigdy się nie spotkacie, ale możecie przekazać sobie coś cennego. Usiądź i zostaw wiadomość dla tych, co przyjdą po nas.',
        'Scrollowanie w nieskończoność nie wniesie za wiele. Zamiast tego możesz skorzystać z telefonu, by przekazać innym, co myślisz! Kto wie, może twoja wiadomość zmieni czyjś dzień?',
      ],
    },
    en: {
      title: 'Leave a message',
      bodies: [
        'Everyone can see the world differently. Sit down and describe what you see, so others can notice it too.',
        'You may never meet, but you can still pass something precious along. Sit down and leave a message for those who come after us.',
        'Endless scrolling will not add much. You can use your phone instead to tell others what you think. Who knows, your message might change someone’s day.',
      ],
    },
  },
  streakSoft: {
    pl: {
      title: 'Twoja seria',
      bodies: [
        'Dawno się nie widzieliśmy! Nie zapominaj o codziennym logowaniu, by utrzymać serię!',
      ],
    },
    en: {
      title: 'Your streak',
      bodies: [
        'We have not seen each other in a while. Do not forget to log in each day to keep your streak.',
      ],
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

  const options: TemplateId[] = [satRecently ? 'messageNudge' : 'sitNudge'];
  if (streak >= 2) options.push('streakSoft');
  return options[Math.floor(Math.random() * options.length)];
}

function pickCopy(templateId: TemplateId, locale: 'pl' | 'en'): { title: string; body: string } {
  const template = TEMPLATES[templateId][locale];
  const body = template.bodies[Math.floor(Math.random() * template.bodies.length)] ?? template.bodies[0];
  return { title: template.title, body };
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
    const message = pickCopy(templateId, locale);
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
