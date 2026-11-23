import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { registerPushToken, showPreviewOnce } from '../lib/pushNotifications';

function randomBody(value: unknown): string | null {
  if (!Array.isArray(value)) return null;
  const bodies = value.filter((item): item is string => typeof item === 'string' && item.length > 0);
  if (bodies.length === 0) return null;
  return bodies[Math.floor(Math.random() * bodies.length)];
}

export function usePushRegistration() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const { t } = useTranslation();

  useEffect(() => {
    if (!user) return;

    let cancelled = false;

    registerPushToken(user.id, language)
      .then(async (mode) => {
        if (cancelled || mode !== 'local-only') return;
        const body = randomBody(t('notifications.sit.bodies', { returnObjects: true }));
        if (body) await showPreviewOnce(t('notifications.sit.title'), body);
      })
      .catch((error) => {
        console.warn('Push registration failed.', error);
      });

    return () => {
      cancelled = true;
    };
  }, [user, language, t]);
}
