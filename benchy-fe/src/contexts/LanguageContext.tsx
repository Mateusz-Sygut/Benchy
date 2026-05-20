import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';
import {
  AppLanguage,
  isLanguagePreference,
  LanguagePreference,
  resolveLanguage,
} from '../i18n/language';

const STORAGE_KEY = '@benchy_language_preference';

type LanguageContextValue = {
  preference: LanguagePreference;
  language: AppLanguage;
  setPreference: (p: LanguagePreference) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preference, setPreferenceState] = useState<LanguagePreference>('system');

  const language = useMemo(() => resolveLanguage(preference), [preference]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!cancelled && isLanguagePreference(stored)) {
          setPreferenceState(stored);
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language).catch(() => {});
    }
  }, [language]);

  const setPreference = useCallback((p: LanguagePreference) => {
    setPreferenceState(p);
    AsyncStorage.setItem(STORAGE_KEY, p).catch(() => {});
  }, []);

  const value = useMemo(
    () => ({ preference, language, setPreference }),
    [preference, language, setPreference]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
};
