import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import en from './locales/en.json';
import pl from './locales/pl.json';

const resources = {
  en: { translation: en },
  pl: { translation: pl },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getLocales()[0]?.languageCode?.split('-')[0] || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

