import { TFunction } from 'i18next';
import { Title, UserProfile } from '../types/database';

type TitleRequirementType =
  | 'always'
  | 'bench_count'
  | 'rating_count'
  | 'favorite_count'
  | 'login_streak';

const TITLE_UNLOCK_RULES: Record<string, { type: TitleRequirementType; value: number }> = {
  novice: { type: 'always', value: 0 },
  benchUser: { type: 'bench_count', value: 1 },
  collector: { type: 'bench_count', value: 10 },
  expert: { type: 'bench_count', value: 50 },
  master: { type: 'bench_count', value: 100 },
  legend: { type: 'login_streak', value: 30 },
};

export function meetsTitleRequirement(titleName: string, profile: UserProfile): boolean {
  const rule = TITLE_UNLOCK_RULES[titleName];
  if (!rule) return false;

  switch (rule.type) {
    case 'always':
      return true;
    case 'bench_count':
      return profile.total_benches_created >= rule.value;
    case 'rating_count':
      return profile.total_ratings_given >= rule.value;
    case 'favorite_count':
      return (profile.total_favorites ?? 0) >= rule.value;
    case 'login_streak':
      return Math.max(profile.current_streak ?? 0, profile.longest_streak ?? 0) >= rule.value;
    default:
      return false;
  }
}

export function getTitleLabel(title: Title, t: TFunction): string {
  return t(`titles.${title.name}`, { defaultValue: title.name });
}

export function getTitleDescription(title: Title, t: TFunction): string {
  return t(title.description, { defaultValue: title.description });
}
