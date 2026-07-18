import { getLocales } from 'expo-localization';

export type LanguagePreference = 'system' | 'en' | 'pl';
export type AppLanguage = 'en' | 'pl';

export function isLanguagePreference(value: string | null): value is LanguagePreference {
  return value === 'system' || value === 'en' || value === 'pl';
}

export function resolveLanguage(preference: LanguagePreference): AppLanguage {
  if (preference === 'en' || preference === 'pl') return preference;
  const code = getLocales()[0]?.languageCode?.split('-')[0];
  return code === 'pl' ? 'pl' : 'en';
}