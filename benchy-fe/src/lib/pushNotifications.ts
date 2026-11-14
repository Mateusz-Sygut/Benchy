import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import supabase from './supabase';

const PREVIEW_KEY = '@benchy_push_preview_shown';

export type PushTemplateId = 'sitNudge' | 'streakSoft' | 'nearbyBench' | 'messageHeart';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

type PushProvider = 'expo' | 'fcm' | 'apns';

function isExpoGo(): boolean {
  return Constants.executionEnvironment === 'storeClient' || Constants.appOwnership === 'expo';
}

async function saveToken(
  userId: string,
  provider: PushProvider,
  token: string,
  locale: string
): Promise<void> {
  const { error } = await supabase.from('user_push_tokens').upsert(
    {
      user_id: userId,
      provider,
      token,
      platform: Platform.OS,
      locale,
      enabled: true,
      updated_at: new Date().toISOString(),
    } as never,
    { onConflict: 'user_id,provider,token' }
  );

  if (error) {
    console.warn('Push token was not saved.', error.message);
  }
}

async function readExpoToken(): Promise<string | null> {
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) return null;

  try {
    const expoToken = await Notifications.getExpoPushTokenAsync({ projectId });
    return expoToken.data;
  } catch (error) {
    console.warn('Expo push token is unavailable in this build.', error);
    return null;
  }
}

async function readNativeToken(): Promise<{ provider: 'fcm' | 'apns'; token: string } | null> {
  if (Constants.executionEnvironment === 'storeClient') return null;

  try {
    const deviceToken = await Notifications.getDevicePushTokenAsync();
    const token = typeof deviceToken.data === 'string' ? deviceToken.data : null;
    if (!token) return null;
    return {
      provider: deviceToken.type === 'ios' ? 'apns' : 'fcm',
      token,
    };
  } catch (error) {
    console.warn('Native push token is unavailable.', error);
    return null;
  }
}

export async function showLocalPreview(title: string, body: string): Promise<boolean> {
  try {
    if (Platform.OS === 'android' && !isExpoGo()) {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: true },
      trigger: null,
    });
    return true;
  } catch (error) {
    console.warn('Local notification preview is unavailable in this build.', error);
    return false;
  }
}

export async function registerPushToken(
  userId: string,
  locale: string
): Promise<'remote' | 'local-only' | 'denied'> {
  if (Platform.OS === 'web') return 'denied';

  const permission = await Notifications.getPermissionsAsync();
  let granted = permission.granted;
  if (!granted) {
    const requested = await Notifications.requestPermissionsAsync();
    granted = requested.granted;
  }
  if (!granted) return 'denied';
  if (isExpoGo()) return 'local-only';

  const expoToken = await readExpoToken();
  if (expoToken) {
    await saveToken(userId, 'expo', expoToken, locale);
  }

  const nativeToken = await readNativeToken();
  if (nativeToken) {
    await saveToken(userId, nativeToken.provider, nativeToken.token, locale);
  }

  return expoToken || nativeToken ? 'remote' : 'local-only';
}

export async function showPreviewOnce(title: string, body: string): Promise<void> {
  const seen = await AsyncStorage.getItem(PREVIEW_KEY);
  if (seen) return;
  const shown = await showLocalPreview(title, body);
  if (shown) await AsyncStorage.setItem(PREVIEW_KEY, '1');
}
