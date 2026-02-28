import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';
import { UserProfile, Achievement, UserAchievement } from '../types/database';

export const useAchievements = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<UserAchievement[]>([]);

  const loadData = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setUserProfile(profile);
      }

      const { data: achievementsData } = await supabase
        .from('achievements')
        .select('*');

      if (achievementsData) {
        setAchievements(achievementsData);
      }

      const { data: userAchievementsData } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      if (userAchievementsData) {
        setUnlockedAchievements(userAchievementsData);
      }
    } catch (error) {
      console.error('Error loading achievements data:', error);
    }
  };

  const checkAchievements = async () => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single() as any;

      if (!profile) return;

      const { data: achievements } = await supabase
        .from('achievements')
        .select('*') as any;

      if (!achievements) return;

      const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', user.id) as any;

      const unlockedAchievementIds = userAchievements?.map((ua: any) => ua.achievement_id) || [];

      const achievementsToUnlock = achievements.filter((achievement: any) => {
        if (unlockedAchievementIds.includes(achievement.id)) return false;

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
      });

      if (achievementsToUnlock.length > 0) {
        const newUserAchievements = achievementsToUnlock.map((achievement: any) => ({
          user_id: user.id,
          achievement_id: achievement.id,
        }));

        await supabase
          .from('user_achievements')
          .insert(newUserAchievements as any);
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };

  const updateUserStats = async (type: 'bench_created' | 'rating_given' | 'time_spent', value: number = 1) => {
    if (!user) return;

    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single() as any;

      if (!profile) {
        await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            total_benches_created: type === 'bench_created' ? value : 0,
            total_ratings_given: type === 'rating_given' ? value : 0,
            total_time_spent: type === 'time_spent' ? value : 0,
          } as any);
      } else {
        const updates: any = {};
        if (type === 'bench_created') {
          updates.total_benches_created = profile.total_benches_created + value;
        } else if (type === 'rating_given') {
          updates.total_ratings_given = profile.total_ratings_given + value;
        } else if (type === 'time_spent') {
          updates.total_time_spent = profile.total_time_spent + value;
        }

        await (supabase as any)
          .from('user_profiles')
          .update(updates)
          .eq('user_id', user.id);
      }

      await checkAchievements();
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  return {
    userProfile,
    achievements,
    unlockedAchievements,
    updateUserStats,
  };
};
