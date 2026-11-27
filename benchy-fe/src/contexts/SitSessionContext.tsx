import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Alert, AppState } from 'react-native';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';
import { useAuth } from './AuthContext';
import { useAchievements } from './AchievementsContext';
import supabase from '../lib/supabase';
import { distanceKm } from '../lib/geocoding';
import { clearActiveSit, readActiveSit, StoredActiveSit, writeActiveSit } from '../lib/activeSitStore';
import { registerSitFlush } from '../lib/sitFlush';
import {
  durationSeconds,
  metersFromKm,
  SIT_GPS_POLL_MS,
  SIT_MIN_DURATION_SEC,
  SIT_RADIUS_M,
  SIT_RESUME_GAP_MS,
  SIT_STORE_MS,
} from '../lib/sitSession';

export type ActiveSitSession = {
  benchId: string;
  benchName: string;
  latitude: number;
  longitude: number;
  startedAtMs: number;
  elapsedSeconds: number;
  withinRange: boolean;
};

type SitTarget = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

type SitSessionContextValue = {
  activeSit: ActiveSitSession | null;
  starting: boolean;
  ending: boolean;
  sitSaveCount: number;
  isSittingOn: (benchId: string) => boolean;
  startSit: (bench: SitTarget) => Promise<boolean>;
  endSit: (reason?: 'manual' | 'left_range') => Promise<void>;
};

const SitSessionContext = createContext<SitSessionContextValue | null>(null);

const savePromises = new Map<string, Promise<boolean>>();

async function getFreshCoords(): Promise<{ latitude: number; longitude: number } | null> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') return null;

  try {
    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  } catch (error) {
    console.warn('Fresh sit location is unavailable.', error);
    return null;
  }
}

function isWithinSitRadius(
  user: { latitude: number; longitude: number },
  bench: { latitude: number; longitude: number },
): boolean {
  return metersFromKm(distanceKm(user, bench)) <= SIT_RADIUS_M;
}

function toActiveSit(stored: StoredActiveSit): ActiveSitSession {
  return {
    benchId: stored.benchId,
    benchName: stored.benchName,
    latitude: stored.latitude,
    longitude: stored.longitude,
    startedAtMs: stored.startedAtMs,
    elapsedSeconds: durationSeconds(stored.startedAtMs),
    withinRange: true,
  };
}

function sitKey(userId: string, session: ActiveSitSession): string {
  return `${userId}:${session.benchId}:${session.startedAtMs}`;
}

export const SitSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { refreshProgress } = useAchievements();
  const [activeSit, setActiveSit] = useState<ActiveSitSession | null>(null);
  const [starting, setStarting] = useState(false);
  const [ending, setEnding] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [sitSaveCount, setSitSaveCount] = useState(0);
  const activeSitRef = useRef<ActiveSitSession | null>(null);
  const endingRef = useRef(false);
  const userIdRef = useRef<string | null>(user?.id ?? null);
  const lastStoredAtRef = useRef(0);

  activeSitRef.current = activeSit;
  userIdRef.current = user?.id ?? null;

  const persistSession = useCallback(
    async (session: ActiveSitSession, endedAtMs: number, userId: string) => {
      const key = sitKey(userId, session);
      const pending = savePromises.get(key);
      if (pending) return pending;

      const save = (async () => {
        const seconds = durationSeconds(session.startedAtMs, endedAtMs);
        if (seconds < SIT_MIN_DURATION_SEC) return false;

        const startedAt = new Date(session.startedAtMs).toISOString();
        const { data: existing, error: existingError } = await supabase
          .from('sit_sessions')
          .select('id')
          .eq('user_id', userId)
          .eq('bench_id', session.benchId)
          .eq('started_at', startedAt)
          .maybeSingle();

        if (existingError) {
          console.error('Error checking sit session:', existingError);
          return false;
        }

        if (!existing) {
          const { error: insertError } = await supabase.from('sit_sessions').insert({
            user_id: userId,
            bench_id: session.benchId,
            started_at: startedAt,
            ended_at: new Date(endedAtMs).toISOString(),
            duration_seconds: seconds,
          } as never);

          if (insertError) {
            console.error('Error saving sit session:', insertError);
            return false;
          }
        }

        await refreshProgress();
        setSitSaveCount((count) => count + 1);
        return true;
      })();

      savePromises.set(key, save);
      try {
        return await save;
      } finally {
        savePromises.delete(key);
      }
    },
    [refreshProgress]
  );

  const storeSit = useCallback(async (session: ActiveSitSession, force = false) => {
    const userId = userIdRef.current;
    if (!userId) return;

    const now = Date.now();
    if (!force && now - lastStoredAtRef.current < SIT_STORE_MS) return;

    lastStoredAtRef.current = now;
    await writeActiveSit({
      userId,
      benchId: session.benchId,
      benchName: session.benchName,
      latitude: session.latitude,
      longitude: session.longitude,
      startedAtMs: session.startedAtMs,
      lastSeenAtMs: now,
    });
  }, []);

  const endSit = useCallback(
    async (reason: 'manual' | 'left_range' = 'manual') => {
      const session = activeSitRef.current;
      const userId = userIdRef.current;
      if (!session || !userId || endingRef.current) return;

      endingRef.current = true;
      setEnding(true);

      try {
        const endedAtMs = Date.now();
        const seconds = durationSeconds(session.startedAtMs, endedAtMs);
        setActiveSit(null);
        activeSitRef.current = null;

        if (seconds < SIT_MIN_DURATION_SEC) {
          await clearActiveSit();
          if (reason === 'left_range') {
            Alert.alert(t('sit.endedTitle'), t('sit.leftRangeTooShort'));
          } else {
            Alert.alert(t('sit.endedTitle'), t('sit.tooShort'));
          }
          return;
        }

        const saved = await persistSession(session, endedAtMs, userId);
        if (!saved) {
          await storeSit(session, true);
          Alert.alert(t('common.error'), t('sit.saveError'));
          return;
        }

        await clearActiveSit();
        const minutes = Math.floor(seconds / 60);
        if (reason === 'left_range') {
          Alert.alert(t('sit.endedTitle'), t('sit.leftRangeSaved', { minutes }));
        } else {
          Alert.alert(t('sit.endedTitle'), t('sit.saved', { minutes }));
        }
      } finally {
        endingRef.current = false;
        setEnding(false);
      }
    },
    [persistSession, storeSit, t]
  );

  const endSitRef = useRef(endSit);
  endSitRef.current = endSit;

  const startSit = useCallback(
    async (bench: SitTarget): Promise<boolean> => {
      if (!user) {
        Alert.alert(t('common.error'), t('sit.needLogin'));
        return false;
      }

      if (restoring) return false;

      if (activeSitRef.current) {
        if (activeSitRef.current.benchId === bench.id) return true;
        Alert.alert(t('sit.alreadySittingTitle'), t('sit.alreadySittingBody'));
        return false;
      }

      setStarting(true);
      try {
        const coords = await getFreshCoords();
        if (!coords) {
          Alert.alert(t('common.error'), t('sit.locationRequired'));
          return false;
        }

        if (!isWithinSitRadius(coords, bench)) {
          Alert.alert(t('sit.tooFarTitle'), t('sit.tooFarBody', { meters: SIT_RADIUS_M }));
          return false;
        }

        const next: ActiveSitSession = {
          benchId: bench.id,
          benchName: bench.name,
          latitude: bench.latitude,
          longitude: bench.longitude,
          startedAtMs: Date.now(),
          elapsedSeconds: 0,
          withinRange: true,
        };
        setActiveSit(next);
        activeSitRef.current = next;
        await storeSit(next, true);
        return true;
      } finally {
        setStarting(false);
      }
    },
    [restoring, storeSit, t, user]
  );

  useEffect(() => {
    return registerSitFlush(async () => {
      const session = activeSitRef.current;
      const userId = userIdRef.current;
      if (!session || !userId) return;

      const endedAtMs = Date.now();
      const seconds = durationSeconds(session.startedAtMs, endedAtMs);
      if (seconds >= SIT_MIN_DURATION_SEC) {
        const saved = await persistSession(session, endedAtMs, userId);
        if (!saved) return;
      }

      await clearActiveSit();
      activeSitRef.current = null;
      setActiveSit(null);
    });
  }, [persistSession]);

  useEffect(() => {
    if (!user) {
      setActiveSit(null);
      activeSitRef.current = null;
      setRestoring(false);
      return;
    }

    let cancelled = false;
    const userId = user.id;
    setRestoring(true);

    const restore = async () => {
      const stored = await readActiveSit();
      if (cancelled || !stored || stored.userId !== userId || activeSitRef.current) return;

      const seconds = durationSeconds(stored.startedAtMs, stored.lastSeenAtMs);
      const gap = Date.now() - stored.lastSeenAtMs;

      if (seconds >= SIT_MIN_DURATION_SEC) {
        const saved = await persistSession(toActiveSit(stored), stored.lastSeenAtMs, userId);
        if (saved) await clearActiveSit();
        return;
      }

      if (gap <= SIT_RESUME_GAP_MS) {
        const next = toActiveSit(stored);
        if (cancelled || activeSitRef.current) return;
        setActiveSit(next);
        activeSitRef.current = next;
        return;
      }

      await clearActiveSit();
    };

    void restore().finally(() => {
      if (!cancelled) setRestoring(false);
    });

    return () => {
      cancelled = true;
    };
  }, [persistSession, user]);

  useEffect(() => {
    if (!activeSit) return;

    const tick = setInterval(() => {
      const session = activeSitRef.current;
      if (!session) return;
      setActiveSit((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          elapsedSeconds: durationSeconds(prev.startedAtMs),
        };
      });
      void storeSit(session);
    }, 1000);

    const gps = setInterval(async () => {
      const session = activeSitRef.current;
      if (!session) return;

      const coords = await getFreshCoords();
      const current = activeSitRef.current;
      if (!coords || !current || current.startedAtMs !== session.startedAtMs) return;

      const withinRange = isWithinSitRadius(coords, current);
      setActiveSit((prev) => (prev ? { ...prev, withinRange } : prev));

      if (!withinRange) {
        await endSitRef.current('left_range');
      }
    }, SIT_GPS_POLL_MS);

    return () => {
      clearInterval(tick);
      clearInterval(gps);
    };
  }, [activeSit?.benchId, storeSit]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      const session = activeSitRef.current;
      if (!session) return;

      if (state === 'active') {
        setActiveSit((prev) =>
          prev ? { ...prev, elapsedSeconds: durationSeconds(prev.startedAtMs) } : prev
        );
        return;
      }

      if (state === 'background' || state === 'inactive') {
        void storeSit(session, true);
      }
    });
    return () => sub.remove();
  }, [storeSit]);

  const isSittingOn = useCallback(
    (benchId: string) => activeSit?.benchId === benchId,
    [activeSit?.benchId]
  );

  const value = useMemo(
    () => ({
      activeSit,
      starting,
      ending,
      sitSaveCount,
      isSittingOn,
      startSit,
      endSit,
    }),
    [activeSit, starting, ending, sitSaveCount, isSittingOn, startSit, endSit]
  );

  return <SitSessionContext.Provider value={value}>{children}</SitSessionContext.Provider>;
};

export function useSitSession(): SitSessionContextValue {
  const ctx = useContext(SitSessionContext);
  if (!ctx) {
    throw new Error('useSitSession must be used within SitSessionProvider');
  }
  return ctx;
}
