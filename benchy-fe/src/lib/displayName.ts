import type { User } from '@supabase/supabase-js';
import i18n from '../i18n';

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function generateNickname(userId: string): string {
  const adjectives = i18n.t('nickname.adjectives', { returnObjects: true }) as string[];
  const nouns = i18n.t('nickname.nouns', { returnObjects: true }) as string[];
  const h = hashString(userId);
  const adj = adjectives[h % adjectives.length] ?? adjectives[0];
  const noun = nouns[Math.floor(h / adjectives.length) % nouns.length] ?? nouns[0];
  return `${adj} ${noun}`;
}

export function generateRandomNickname(): string {
  const adjectives = i18n.t('nickname.adjectives', { returnObjects: true }) as string[];
  const nouns = i18n.t('nickname.nouns', { returnObjects: true }) as string[];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)] ?? adjectives[0];
  const noun = nouns[Math.floor(Math.random() * nouns.length)] ?? nouns[0];
  return `${adj} ${noun}`;
}

export function getDisplayName(user: User | null): string {
  if (!user) return '';
  const username = user.user_metadata?.username;
  if (username && typeof username === 'string' && username.trim()) {
    return username.trim();
  }
  return generateNickname(user.id);
}
