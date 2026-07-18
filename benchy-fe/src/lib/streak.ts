/** Local calendar date as YYYY-MM-DD (device timezone). */
export function getLocalDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseLocalDate(dateStr: string): Date {
  return new Date(`${dateStr}T12:00:00`);
}

export function daysBetween(earlier: string, later: string): number {
  const diffMs = parseLocalDate(later).getTime() - parseLocalDate(earlier).getTime();
  return Math.round(diffMs / 86_400_000);
}

export type StreakUpdate = {
  current_streak: number;
  longest_streak: number;
  last_login_date: string;
  changed: boolean;
};

export function computeLoginStreak(
  lastLoginDate: string | null | undefined,
  currentStreak: number,
  longestStreak: number,
  today: string = getLocalDateString()
): StreakUpdate {
  if (lastLoginDate === today) {
    return {
      current_streak: currentStreak,
      longest_streak: longestStreak,
      last_login_date: today,
      changed: false,
    };
  }

  let nextStreak: number;
  if (!lastLoginDate) {
    nextStreak = 1;
  } else {
    const gap = daysBetween(lastLoginDate, today);
    nextStreak = gap === 1 ? currentStreak + 1 : 1;
  }

  return {
    current_streak: nextStreak,
    longest_streak: Math.max(longestStreak, nextStreak),
    last_login_date: today,
    changed: true,
  };
}