import type { User } from '@supabase/supabase-js';
import i18n from '../i18n';

type Gender = 'm' | 'f' | 'n';
type GenderedLists = Record<Gender, string[]>;

const GENDERS: Gender[] = ['m', 'f', 'n'];

function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function isGenderedLists(value: unknown): value is GenderedLists {
  if (!value || typeof value !== 'object') return false;
  const lists = value as Record<string, unknown>;
  return GENDERS.every((g) => Array.isArray(lists[g]) && (lists[g] as string[]).length > 0);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && typeof value[0] === 'string';
}

function pickFromGendered(
  adjectives: GenderedLists,
  nouns: GenderedLists,
  genderIndex: number,
  adjIndex: number,
  nounIndex: number
): string {
  const gender = GENDERS[genderIndex % GENDERS.length];
  const adjList = adjectives[gender];
  const nounList = nouns[gender];
  const adj = adjList[adjIndex % adjList.length] ?? adjList[0];
  const noun = nounList[nounIndex % nounList.length] ?? nounList[0];
  return `${adj} ${noun}`;
}

function pickFromFlat(
  adjectives: string[],
  nouns: string[],
  adjIndex: number,
  nounIndex: number
): string {
  const adj = adjectives[adjIndex % adjectives.length] ?? adjectives[0];
  const noun = nouns[nounIndex % nouns.length] ?? nouns[0];
  return `${adj} ${noun}`;
}

function buildNickname(adjSeed: number, nounSeed: number, genderSeed?: number): string {
  const adjectivesRaw = i18n.t('nickname.adjectives', { returnObjects: true });
  const nounsRaw = i18n.t('nickname.nouns', { returnObjects: true });

  if (isGenderedLists(adjectivesRaw) && isGenderedLists(nounsRaw)) {
    return pickFromGendered(
      adjectivesRaw,
      nounsRaw,
      genderSeed ?? adjSeed,
      adjSeed,
      nounSeed
    );
  }

  if (isStringArray(adjectivesRaw) && isStringArray(nounsRaw)) {
    return pickFromFlat(adjectivesRaw, nounsRaw, adjSeed, nounSeed);
  }

  return 'Bench Friend';
}

function generateNickname(userId: string): string {
  const h = hashString(userId);
  return buildNickname(h, Math.floor(h / 97), h);
}

export function generateRandomNickname(): string {
  return buildNickname(
    Math.floor(Math.random() * 1_000_000),
    Math.floor(Math.random() * 1_000_000),
    Math.floor(Math.random() * GENDERS.length)
  );
}

export function getDisplayName(user: User | null): string {
  if (!user) return '';
  const username = user.user_metadata?.username;
  if (username && typeof username === 'string' && username.trim()) {
    return username.trim();
  }
  return generateNickname(user.id);
}
