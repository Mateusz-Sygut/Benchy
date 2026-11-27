import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@benchy_active_sit';

export type StoredActiveSit = {
  userId: string;
  benchId: string;
  benchName: string;
  latitude: number;
  longitude: number;
  startedAtMs: number;
  lastSeenAtMs: number;
};

export async function readActiveSit(): Promise<StoredActiveSit | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredActiveSit;
    if (!parsed?.userId || !parsed.benchId || !parsed.startedAtMs) return null;
    return parsed;
  } catch (error) {
    console.warn('Active sit could not be read.', error);
    return null;
  }
}

export async function writeActiveSit(sit: StoredActiveSit): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sit));
  } catch (error) {
    console.warn('Active sit could not be stored.', error);
  }
}

export async function clearActiveSit(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('Active sit could not be cleared.', error);
  }
}
