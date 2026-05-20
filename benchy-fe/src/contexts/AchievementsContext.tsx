import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from './AuthContext';
import supabase from '../lib/supabase';
import { Achievement, UserAchievement, UserProfile } from '../types/database';

type StatUpdateType = 'bench_created' | 'rating_given' | 'time_spent' | 'favorite';

type AchievementsContextValue = {
  userProfile: UserProfile | null;
  achievements: Achievement[];
  unlockedAchievements: UserAchievement[];
  updateUserStats: (type: StatUpdateType, value?: number) => Promise<void>;
  refreshAchievements: () => Promise<void>;
};

const AchievementsContext = createContext<AchievementsContextValue | null>(null);

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

  const loadData = useCallback(async () => {
    if (!user) {
      setUserProfile(null);
      setAchievements([]);
      setUnlockedAchievements([]);
      return;
    }

    try {
      let profile = await syncProfileCounts();
      if (profile) {
        profile = await checkAchievements(profile);
        setUserProfile(profile);
      }

      const { data: achievementsData } = await supabase.from('achievements').select('*');
      if (achievementsData) {
        setAchievements(achievementsData as Achievement[]);
      }

      const { data: userAchievementsData } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      if (userAchievementsData) {
        setUnlockedAchievements(userAchievementsData as UserAchievement[]);
      }
    } catch (error) {
      console.error('Error loading achievements data:', error);
    }
  }, [user, syncProfileCounts, checkAchievements]);

  const updateUserStats = useCallback(
    async (_type: StatUpdateType, _value: number = 1) => {
      if (!user) return;
      try {
        await loadData();
      } catch (error) {
        console.error('Error updating user stats:', error);
      }
    },
    [user, loadData]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const value = useMemo(
    () => ({
      userProfile,
      achievements,
      unlockedAchievements,
      updateUserStats,
      refreshAchievements: loadData,
    }),
    [userProfile, achievements, unlockedAchievements, updateUserStats, loadData]
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
