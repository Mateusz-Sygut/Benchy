import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppState } from 'react-native';
import { useAuth } from './AuthContext';
import supabase from '../lib/supabase';
import { addMinutesToTotal, elapsedWholeMinutes } from '../lib/appTime';
import { computeLoginStreak } from '../lib/streak';
import { meetsTitleRequirement } from '../lib/titles';
import { Achievement, Title, UserAchievement, UserProfile } from '../types/database';

type AchievementsContextValue = {
  userProfile: UserProfile | null;
  achievements: Achievement[];
  unlockedAchievements: UserAchievement[];
  titles: Title[];
  unlockedTitles: Title[];
  selectedTitle: Title | null;
  selectTitle: (titleId: string) => Promise<void>;
  refreshProgress: () => Promise<void>;
  refreshAchievements: () => Promise<void>;
};

const AchievementsContext = createContext<AchievementsContextValue | null>(null);

let streakSchemaUnavailable = false;

function isStreakSchemaError(error: { code?: string; message?: string }): boolean {
  return error.code === 'PGRST204' && (error.message?.includes('current_streak') ?? false);
}

async function countForUser(
  table: 'benches' | 'ratings' | 'favorites',
  userId: string
): Promise<number> {
  const { count, error } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) {
    console.error(`Error counting ${table}:`, error);
    return 0;
  }
  return count ?? 0;
}

export const AchievementsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<UserAchievement[]>([]);
  const [titles, setTitles] = useState<Title[]>([]);
  const [unlockedTitles, setUnlockedTitles] = useState<Title[]>([]);
  const sessionStartRef = useRef<number | null>(null);
  const recordingMutexRef = useRef(false);
  const titlesRef = useRef(titles);
  titlesRef.current = titles;

  const startSessionTimer = useCallback(() => {
    sessionStartRef.current = Date.now();
  }, []);

  const recordSessionTime = useCallback(
    async (profile: UserProfile, endSession: boolean): Promise<UserProfile> => {
      if (!user || sessionStartRef.current === null) return profile;

      const minutes = elapsedWholeMinutes(sessionStartRef.current);
      sessionStartRef.current = endSession ? null : Date.now();

      if (minutes <= 0) return profile;

      const totalTimeSpent = addMinutesToTotal(profile.total_time_spent ?? 0, minutes);
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ total_time_spent: totalTimeSpent } as never)
        .eq('user_id', user.id)
        .select('*')
        .single();

      if (error) {
        if (error.code === 'PGRST204' && (error.message?.includes('total_time_spent') ?? false)) {
          console.warn(
            'total_time_spent column missing in Supabase. Run benchy-be/supabase/migrations/database.sql'
          );
        } else {
          console.error('Error recording app time:', error);
        }
        return profile;
      }

      return data as UserProfile;
    },
    [user]
  );

  const syncProfileCounts = useCallback(async (): Promise<UserProfile | null> => {
    if (!user) return null;

    const [totalBenches, totalRatings, totalFavorites] = await Promise.all([
      countForUser('benches', user.id),
      countForUser('ratings', user.id),
      countForUser('favorites', user.id),
    ]);

    const counts = {
      total_benches_created: totalBenches,
      total_ratings_given: totalRatings,
      total_favorites: totalFavorites,
    };

    const { data: existing } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!existing) {
      const { data: created, error } = await supabase
        .from('user_profiles')
        .insert({ user_id: user.id, ...counts } as never)
        .select('*')
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        return null;
      }
      return created as UserProfile;
    }

    const { data: updated, error } = await supabase
      .from('user_profiles')
      .update(counts as never)
      .eq('user_id', user.id)
      .select('*')
      .single();

    if (error) {
      console.error('Error syncing user profile:', error);
      return existing as UserProfile;
    }

    return updated as UserProfile;
  }, [user]);

  const recordLoginStreak = useCallback(
    async (profile: UserProfile): Promise<UserProfile> => {
      if (!user || streakSchemaUnavailable) return profile;

      const next = computeLoginStreak(
        profile.last_login_date,
        profile.current_streak ?? 0,
        profile.longest_streak ?? 0
      );

      if (!next.changed) return profile;

      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          current_streak: next.current_streak,
          longest_streak: next.longest_streak,
          last_login_date: next.last_login_date,
        } as never)
        .eq('user_id', user.id)
        .select('*')
        .single();

      if (error) {
        if (isStreakSchemaError(error)) {
          streakSchemaUnavailable = true;
          console.warn(
            'Login streak columns missing in Supabase. Run benchy-be/supabase/migrations/add_login_streak.sql'
          );
        } else {
          console.error('Error recording login streak:', error);
        }
        return profile;
      }

      return data as UserProfile;
    },
    [user]
  );

  const checkAchievements = useCallback(
    async (profile: UserProfile): Promise<UserProfile> => {
      if (!user) return profile;

      const { data: allAchievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*') as { data: Achievement[] | null; error: Error | null };

      if (achievementsError || !allAchievements?.length) {
        if (achievementsError) console.error('Error loading achievements:', achievementsError);
        return profile;
      }

      const { data: userAchievements } = (await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', user.id)) as { data: { achievement_id: string }[] | null };

      const unlockedIds = new Set(
        (userAchievements ?? []).map((ua) => ua.achievement_id)
      );

      const meetsRequirement = (achievement: Achievement): boolean => {
        switch (achievement.requirement_type) {
          case 'bench_count':
            return profile.total_benches_created >= achievement.requirement_value;
          case 'rating_count':
            return profile.total_ratings_given >= achievement.requirement_value;
          case 'time_spent':
            return profile.total_time_spent >= achievement.requirement_value;
          case 'favorite_count':
            return (profile.total_favorites ?? 0) >= achievement.requirement_value;
          case 'login_streak':
            return (profile.current_streak ?? 0) >= achievement.requirement_value;
          default:
            return false;
        }
      };

      const toUnlock = allAchievements.filter(
        (a) => !unlockedIds.has(a.id) && meetsRequirement(a)
      );

      if (toUnlock.length === 0) return profile;

      const { error: insertError } = await supabase.from('user_achievements').insert(
        toUnlock.map((a) => ({
          user_id: user.id,
          achievement_id: a.id,
        })) as never
      );

      if (insertError) {
        console.error('Error unlocking achievements:', insertError);
        return profile;
      }

      const pointsEarned = toUnlock.reduce((sum, a) => sum + (a.points ?? 0), 0);

      if (pointsEarned > 0) {
        const currentXp = profile.experience_points ?? 0;
        const { data: withXp, error: xpError } = await supabase
          .from('user_profiles')
          .update({ experience_points: currentXp + pointsEarned } as never)
          .eq('user_id', user.id)
          .select('*')
          .single();

        if (!xpError && withXp) {
          return withXp as UserProfile;
        }
      }

      return profile;
    },
    [user]
  );

  const checkTitles = useCallback(
    async (profile: UserProfile, allTitles: Title[]): Promise<UserProfile> => {
      if (!user || allTitles.length === 0) return profile;

      const { data: userTitleRows } = (await supabase
        .from('user_titles')
        .select('title_id')
        .eq('user_id', user.id)) as { data: { title_id: string }[] | null };

      const unlockedIds = new Set((userTitleRows ?? []).map((row) => row.title_id));

      const toUnlock = allTitles.filter(
        (title) => !unlockedIds.has(title.id) && meetsTitleRequirement(title.name, profile)
      );

      if (toUnlock.length > 0) {
        const { error: insertError } = await supabase.from('user_titles').insert(
          toUnlock.map((title) => ({
            user_id: user.id,
            title_id: title.id,
          })) as never
        );

        if (insertError) {
          console.error('Error unlocking titles:', insertError);
        }
      }

      const novice = allTitles.find((title) => title.name === 'novice');
      if (!profile.selected_title_id && novice) {
        const defaultTitleId =
          [...allTitles]
            .filter((title) => unlockedIds.has(title.id) || toUnlock.some((t) => t.id === title.id))
            .sort((a, b) => b.rarity_level - a.rarity_level)[0]?.id ?? novice.id;

        const { data: updated, error } = await supabase
          .from('user_profiles')
          .update({ selected_title_id: defaultTitleId } as never)
          .eq('user_id', user.id)
          .select('*')
          .single();

        if (!error && updated) {
          return updated as UserProfile;
        }
      }

      return profile;
    },
    [user]
  );

  const reloadUnlockedState = useCallback(
    async (catalog: Title[]) => {
      if (!user) return;

      const { data: userAchievementsData } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      if (userAchievementsData) {
        setUnlockedAchievements(userAchievementsData as UserAchievement[]);
      }

      const { data: userTitleRows } = (await supabase
        .from('user_titles')
        .select('title_id')
        .eq('user_id', user.id)) as { data: { title_id: string }[] | null };

      const unlockedIds = new Set((userTitleRows ?? []).map((row) => row.title_id));
      setUnlockedTitles(catalog.filter((title) => unlockedIds.has(title.id)));
    },
    [user]
  );

  const flushSessionTime = useCallback(
    async (endSession: boolean, baseProfile?: UserProfile | null): Promise<UserProfile | null> => {
      if (!user || recordingMutexRef.current || sessionStartRef.current === null) {
        return baseProfile ?? null;
      }

      recordingMutexRef.current = true;
      try {
        let profile = baseProfile ?? null;
        if (!profile) {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (error) {
            console.error('Error loading profile for session time:', error);
            return null;
          }
          profile = data as UserProfile | null;
        }

        if (!profile) {
          profile = await syncProfileCounts();
          if (!profile) return null;
        }

        profile = await recordSessionTime(profile, endSession);
        profile = await checkAchievements(profile);

        const catalog = titlesRef.current;
        if (catalog.length > 0) {
          profile = await checkTitles(profile, catalog);
        }

        setUserProfile(profile);
        await reloadUnlockedState(catalog);
        return profile;
      } finally {
        recordingMutexRef.current = false;
      }
    },
    [user, syncProfileCounts, recordSessionTime, checkAchievements, checkTitles, reloadUnlockedState]
  );

  const flushSessionTimeRef = useRef(flushSessionTime);
  flushSessionTimeRef.current = flushSessionTime;

  const loadDataRef = useRef<() => Promise<void>>(async () => {});

  const refreshProgress = useCallback(async () => {
    if (!user) return;

    try {
      let catalog = titles;
      if (catalog.length === 0) {
        const { data: titlesData } = await supabase.from('titles').select('*');
        catalog = ((titlesData ?? []) as Title[]).sort((a, b) => a.rarity_level - b.rarity_level);
        if (catalog.length > 0) {
          setTitles(catalog);
        }
      }

      let profile = await syncProfileCounts();
      if (!profile) return;

      await flushSessionTime(false, profile);
    } catch (error) {
      console.error('Error refreshing progress:', error);
    }
  }, [user, titles, syncProfileCounts, flushSessionTime]);

  const loadData = useCallback(async () => {
    if (!user) {
      setUserProfile(null);
      setAchievements([]);
      setUnlockedAchievements([]);
      setTitles([]);
      setUnlockedTitles([]);
      return;
    }

    try {
      const { data: titlesData } = await supabase.from('titles').select('*');
      const catalog = (titlesData ?? []) as Title[];
      catalog.sort((a, b) => a.rarity_level - b.rarity_level);
      setTitles(catalog);

      let profile = await syncProfileCounts();
      if (profile) {
        profile = await recordLoginStreak(profile);
        profile = await checkAchievements(profile);
        profile = await checkTitles(profile, catalog);
        setUserProfile(profile);
      }

      const { data: achievementsData } = await supabase.from('achievements').select('*');
      if (achievementsData) {
        setAchievements(achievementsData as Achievement[]);
      }

      await reloadUnlockedState(catalog);
    } catch (error) {
      console.error('Error loading achievements data:', error);
    }
  }, [user, syncProfileCounts, recordLoginStreak, checkAchievements, checkTitles, reloadUnlockedState]);

  loadDataRef.current = loadData;

  const selectTitle = useCallback(
    async (titleId: string) => {
      if (!user) return;

      const isUnlocked = unlockedTitles.some((title) => title.id === titleId);
      if (!isUnlocked) return;

      const { error } = await supabase
        .from('user_profiles')
        .update({ selected_title_id: titleId } as never)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error selecting title:', error);
        return;
      }

      setUserProfile((prev) => (prev ? { ...prev, selected_title_id: titleId } : prev));
    },
    [user, unlockedTitles]
  );

  const selectedTitle = useMemo(() => {
    if (!userProfile) return null;
    const selected = titles.find((title) => title.id === userProfile.selected_title_id);
    if (selected && unlockedTitles.some((title) => title.id === selected.id)) {
      return selected;
    }
    return unlockedTitles.find((title) => title.name === 'novice') ?? unlockedTitles[0] ?? null;
  }, [titles, unlockedTitles, userProfile]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!user) {
      sessionStartRef.current = null;
      return;
    }

    startSessionTimer();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        startSessionTimer();
        void loadDataRef.current();
        return;
      }

      if (state === 'background') {
        void flushSessionTimeRef.current(true);
      }
    });

    const interval = setInterval(() => {
      if (AppState.currentState === 'active') {
        void flushSessionTimeRef.current(false);
      }
    }, 60_000);

    return () => {
      subscription.remove();
      clearInterval(interval);
      void flushSessionTimeRef.current(true);
    };
  }, [user, startSessionTimer]);

  const value = useMemo(
    () => ({
      userProfile,
      achievements,
      unlockedAchievements,
      titles,
      unlockedTitles,
      selectedTitle,
      selectTitle,
      refreshProgress,
      refreshAchievements: loadData,
    }),
    [
      userProfile,
      achievements,
      unlockedAchievements,
      titles,
      unlockedTitles,
      selectedTitle,
      selectTitle,
      refreshProgress,
      loadData,
    ]
  );

  return (
    <AchievementsContext.Provider value={value}>{children}</AchievementsContext.Provider>
  );
};

export function useAchievements(): AchievementsContextValue {
  const ctx = useContext(AchievementsContext);
  if (!ctx) {
    throw new Error('useAchievements must be used within AchievementsProvider');
  }
  return ctx;
}
