import { Ionicons } from '@expo/vector-icons';
import { UserProfile } from '../types/database';

export type UserTask = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  labelKey: string;
  labelParams?: Record<string, string | number>;
  isComplete: boolean;
  onPress: () => void;
};

export type ActiveUserTasks = {
  tierIndex: number;
  tierTotal: number;
  subtitleKey: string;
  tasks: UserTask[];
  allComplete: boolean;
};

type NavigateFn = (screen: string) => void;

type TaskTierDef = {
  subtitleKey: string;
  build: (profile: UserProfile | null | undefined, navigate: NavigateFn) => UserTask[];
};

function streakDays(profile: UserProfile | null | undefined): number {
  return Math.max(profile?.current_streak ?? 0, profile?.longest_streak ?? 0);
}

function hasAvatar(profile: UserProfile | null | undefined): boolean {
  return Boolean(profile?.avatar_url?.trim());
}

const TASK_TIERS: TaskTierDef[] = [
  {
    subtitleKey: 'tasks.tierStarter',
    build: (profile, navigate) => {
      const benches = profile?.total_benches_created ?? 0;
      const ratings = profile?.total_ratings_given ?? 0;
      const favorites = profile?.total_favorites ?? 0;

      return [
        {
          id: 'addFirstBench',
          icon: 'add-circle',
          labelKey: 'tasks.addFirstBench',
          isComplete: benches >= 1,
          onPress: () => navigate(benches >= 1 ? 'MyBenches' : 'AddBench'),
        },
        {
          id: 'rateBench',
          icon: 'star',
          labelKey: 'tasks.rateBench',
          isComplete: ratings >= 1,
          onPress: () => navigate(ratings >= 1 ? 'MyRatings' : 'BenchList'),
        },
        {
          id: 'addFavorite',
          icon: 'heart',
          labelKey: 'tasks.addFavorite',
          isComplete: favorites >= 1,
          onPress: () => navigate(favorites >= 1 ? 'Favorites' : 'BenchList'),
        },
      ];
    },
  },
  {
    subtitleKey: 'tasks.tierExplorer',
    build: (profile, navigate) => {
      const benches = profile?.total_benches_created ?? 0;
      const streak = streakDays(profile);
      const avatar = hasAvatar(profile);

      return [
        {
          id: 'setAvatar',
          icon: 'camera',
          labelKey: 'tasks.setAvatar',
          isComplete: avatar,
          onPress: () => navigate('Profile'),
        },
        {
          id: 'loginStreak3',
          icon: 'flame',
          labelKey: 'tasks.loginStreak',
          labelParams: { count: 3 },
          isComplete: streak >= 3,
          onPress: () => navigate('Profile'),
        },
        {
          id: 'addFiveBenches',
          icon: 'layers',
          labelKey: 'tasks.addBenches',
          labelParams: { count: 5 },
          isComplete: benches >= 5,
          onPress: () => navigate(benches >= 5 ? 'MyBenches' : 'AddBench'),
        },
      ];
    },
  },
  {
    subtitleKey: 'tasks.tierRegular',
    build: (profile, navigate) => {
      const ratings = profile?.total_ratings_given ?? 0;
      const favorites = profile?.total_favorites ?? 0;
      const streak = streakDays(profile);

      return [
        {
          id: 'rateTen',
          icon: 'star-half',
          labelKey: 'tasks.giveRatings',
          labelParams: { count: 10 },
          isComplete: ratings >= 10,
          onPress: () => navigate(ratings >= 10 ? 'MyRatings' : 'BenchList'),
        },
        {
          id: 'favoriteTen',
          icon: 'heart-circle',
          labelKey: 'tasks.addFavorites',
          labelParams: { count: 10 },
          isComplete: favorites >= 10,
          onPress: () => navigate(favorites >= 10 ? 'Favorites' : 'BenchList'),
        },
        {
          id: 'loginStreak7',
          icon: 'flame',
          labelKey: 'tasks.loginStreak',
          labelParams: { count: 7 },
          isComplete: streak >= 7,
          onPress: () => navigate('Profile'),
        },
      ];
    },
  },
];

export function getActiveUserTasks(
  profile: UserProfile | null | undefined,
  navigate: NavigateFn,
): ActiveUserTasks {
  for (let i = 0; i < TASK_TIERS.length; i++) {
    const tasks = TASK_TIERS[i].build(profile, navigate);
    const tierComplete = tasks.every((task) => task.isComplete);

    if (!tierComplete) {
      return {
        tierIndex: i + 1,
        tierTotal: TASK_TIERS.length,
        subtitleKey: TASK_TIERS[i].subtitleKey,
        tasks,
        allComplete: false,
      };
    }
  }

  const lastTier = TASK_TIERS[TASK_TIERS.length - 1];
  return {
    tierIndex: TASK_TIERS.length,
    tierTotal: TASK_TIERS.length,
    subtitleKey: 'tasks.allComplete',
    tasks: lastTier.build(profile, navigate),
    allComplete: true,
  };
}