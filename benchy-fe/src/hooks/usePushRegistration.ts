import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { registerPushToken, showPreviewOnce } from '../lib/pushNotifications';

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
        await showPreviewOnce(t('notifications.sitNudge.title'), t('notifications.sitNudge.body'));
      })
      .catch((error) => {
        console.warn('Push registration failed.', error);
      });

    return () => {
      cancelled = true;
    };
  }, [user, language, t]);
}
