import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const PENDING_EMAIL_CONFIRM_KEY = 'lawappka.pendingEmailConfirm';

const DEFAULT_REDIRECT_URL =
  'https://cdn.jsdelivr.net/gh/Mateusz-Sygut/Benchy@main/benchy-fe/public/email-confirmed.html';

export function emailConfirmRedirectUrl(): string {
  const configured = Constants.expoConfig?.extra?.EMAIL_CONFIRM_REDIRECT_URL;
  return typeof configured === 'string' && configured.length > 0
    ? configured
    : DEFAULT_REDIRECT_URL;
}

export async function rememberPendingEmailConfirm(email: string): Promise<void> {
  await AsyncStorage.setItem(PENDING_EMAIL_CONFIRM_KEY, email);
}

export async function consumePendingActivation(
  email: string | undefined,
  confirmedAt: string | null | undefined,
): Promise<boolean> {
  if (!email || !confirmedAt) return false;
  const pending = await AsyncStorage.getItem(PENDING_EMAIL_CONFIRM_KEY);
  if (!pending || pending !== email) return false;
  await AsyncStorage.removeItem(PENDING_EMAIL_CONFIRM_KEY);
  return true;
}
