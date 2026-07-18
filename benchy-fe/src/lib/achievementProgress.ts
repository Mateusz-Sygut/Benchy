import { TFunction } from 'i18next';
import { Achievement, UserProfile } from '../types/database';

export type AchievementProgress = {
  current: number;
  target: number;
};

export function getAchievementProgress(
  achievement: Achievement,
  profile: UserProfile | null | undefined,
): AchievementProgress | null {
  if (!profile) return null;

  const target = achievement.requirement_value;
  if (target <= 0) return null;

  switch (achievement.requirement_type) {
    case 'time_spent':
      return { current: profile.total_time_spent ?? 0, target };
    case 'bench_count':
      return { current: profile.total_benches_created ?? 0, target };
    case 'rating_count':
      return { current: profile.total_ratings_given ?? 0, target };
    case 'favorite_count':
      return { current: profile.total_favorites ?? 0, target };
    case 'login_streak':
      return {
        current: Math.max(profile.current_streak ?? 0, profile.longest_streak ?? 0),
        target,
      };
    case 'sit_count':
      return { current: profile.total_sit_sessions ?? 0, target };
    case 'sit_minutes':
      return { current: profile.total_sit_minutes ?? 0, target };
    case 'sit_session':
      return { current: profile.longest_sit_minutes ?? 0, target };
    default:
      return null;
  }
}

export function formatAchievementProgress(
  achievement: Achievement,
  profile: UserProfile | null | undefined,
  t: TFunction,
): string | null {
  const progress = getAchievementProgress(achievement, profile);
  if (!progress) return null;

  const current = Math.min(progress.current, progress.target);

  if (
    achievement.requirement_type === 'time_spent' ||
    achievement.requirement_type === 'sit_session' ||
    achievement.requirement_type === 'sit_minutes'
  ) {
    return t('achievements.progressMinutes', {
      current,
      target: progress.target,
    });
  }

  return t('achievements.progressCount', {
    current,
    target: progress.target,
  });
}