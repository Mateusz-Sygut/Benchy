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
import {
  durationSeconds,
  metersFromKm,
  SIT_GPS_POLL_MS,
  SIT_MIN_DURATION_SEC,
  SIT_RADIUS_M,
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
  isSittingOn: (benchId: string) => boolean;
  startSit: (bench: SitTarget) => Promise<boolean>;
  endSit: (reason?: 'manual' | 'left_range') => Promise<void>;
};

const SitSessionContext = createContext<SitSessionContextValue | null>(null);

async function getCurrentCoords(): Promise<{ latitude: number; longitude: number } | null> {
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
  } catch {
    const lastKnown = await Location.getLastKnownPositionAsync();
    if (!lastKnown) return null;
    return {
      latitude: lastKnown.coords.latitude,
      longitude: lastKnown.coords.longitude,
    };
  }
}

function isWithinSitRadius(
  user: { latitude: number; longitude: number },
  bench: { latitude: number; longitude: number },
): boolean {
  return metersFromKm(distanceKm(user, bench)) <= SIT_RADIUS_M;
}

export const SitSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { refreshProgress } = useAchievements();
  const [activeSit, setActiveSit] = useState<ActiveSitSession | null>(null);
  const [starting, setStarting] = useState(false);
  const [ending, setEnding] = useState(false);
  const activeSitRef = useRef<ActiveSitSession | null>(null);
  const endingRef = useRef(false);

  activeSitRef.current = activeSit;

  const persistSession = useCallback(
    async (session: ActiveSitSession, endedAtMs: number) => {
      if (!user) return false;

      const seconds = durationSeconds(session.startedAtMs, endedAtMs);
      if (seconds < SIT_MIN_DURATION_SEC) return false;

      const { error: insertError } = await supabase.from('sit_sessions').insert({
        user_id: user.id,
        bench_id: session.benchId,
        started_at: new Date(session.startedAtMs).toISOString(),
        ended_at: new Date(endedAtMs).toISOString(),
        duration_seconds: seconds,
      } as never);

      if (insertError) {
        console.error('Error saving sit session:', insertError);
        return false;
      }

      // Totals + achievements come from syncProfileCounts inside refreshProgress.
      await refreshProgress();
      return true;
    },
    [user, refreshProgress]
  );

  const endSit = useCallback(
    async (reason: 'manual' | 'left_range' = 'manual') => {
      const session = activeSitRef.current;
      if (!session || endingRef.current) return;

      endingRef.current = true;
      setEnding(true);

      try {
        const endedAtMs = Date.now();
        const seconds = durationSeconds(session.startedAtMs, endedAtMs);
        setActiveSit(null);
        activeSitRef.current = null;

        if (seconds < SIT_MIN_DURATION_SEC) {
          if (reason === 'left_range') {
            Alert.alert(t('sit.endedTitle'), t('sit.leftRangeTooShort'));
          } else {
            Alert.alert(t('sit.endedTitle'), t('sit.tooShort'));
          }
          return;
        }

        const saved = await persistSession(session, endedAtMs);
        if (!saved) {
          Alert.alert(t('common.error'), t('sit.saveError'));
          return;
        }

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
    [persistSession, t]
  );

  const endSitRef = useRef(endSit);
  endSitRef.current = endSit;

  const startSit = useCallback(
    async (bench: SitTarget): Promise<boolean> => {
      if (!user) {
        Alert.alert(t('common.error'), t('sit.needLogin'));
        return false;
      }

      if (activeSitRef.current) {
        if (activeSitRef.current.benchId === bench.id) return true;
        Alert.alert(t('sit.alreadySittingTitle'), t('sit.alreadySittingBody'));
        return false;
      }

      setStarting(true);
      try {
        const coords = await getCurrentCoords();
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
        return true;
      } finally {
        setStarting(false);
      }
    },
    [user, t]
  );

  useEffect(() => {
    if (!activeSit) return;

    const tick = setInterval(() => {
      setActiveSit((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          elapsedSeconds: durationSeconds(prev.startedAtMs),
        };
      });
    }, 1000);

    const gps = setInterval(async () => {
      const session = activeSitRef.current;
      if (!session) return;

      const coords = await getCurrentCoords();
      if (!coords) return;

      const withinRange = isWithinSitRadius(coords, session);
      setActiveSit((prev) => (prev ? { ...prev, withinRange } : prev));

      if (!withinRange) {
        await endSitRef.current('left_range');
      }
    }, SIT_GPS_POLL_MS);

    return () => {
      clearInterval(tick);
      clearInterval(gps);
    };
  }, [activeSit?.benchId]);

  useEffect(() => {
    if (!user) {
      setActiveSit(null);
      activeSitRef.current = null;
    }
  }, [user]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active' && activeSitRef.current) {
        setActiveSit((prev) =>
          prev ? { ...prev, elapsedSeconds: durationSeconds(prev.startedAtMs) } : prev
        );
      }
    });
    return () => sub.remove();
  }, []);

  const isSittingOn = useCallback(
    (benchId: string) => activeSit?.benchId === benchId,
    [activeSit?.benchId]
  );

  const value = useMemo(
    () => ({
      activeSit,
      starting,
      ending,
      isSittingOn,
      startSit,
      endSit,
    }),
    [activeSit, starting, ending, isSittingOn, startSit, endSit]
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