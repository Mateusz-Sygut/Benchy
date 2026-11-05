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
    case 'sit_minutes':
      return { current: profile.total_sit_minutes ?? 0, target };
    case 'bench_count':
      return { current: profile.total_benches_created ?? 0, target };
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
    case 'message_count':
      return { current: profile.total_messages_left ?? 0, target };
    default:
      return null;
  }
}

const SHOWCASE_BADGE_COUNT = 3;

export function pickShowcaseAchievements(
  achievements: Achievement[],
  unlockedIds: ReadonlySet<string>,
): Achievement[] {
  return achievements
    .filter((achievement) => unlockedIds.has(achievement.id))
    .sort((a, b) => {
      const byTier = b.token_tier - a.token_tier;
      if (byTier !== 0) return byTier;
      const byPoints = b.points - a.points;
      if (byPoints !== 0) return byPoints;
      return a.name.localeCompare(b.name);
    })
    .slice(0, SHOWCASE_BADGE_COUNT);
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