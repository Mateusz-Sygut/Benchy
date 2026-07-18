export const SIT_RADIUS_M = 80;

export const SIT_GPS_POLL_MS = 25_000;

export const SIT_MIN_DURATION_SEC = 120;

export function metersFromKm(km: number): number {
  return km * 1000;
}

export function formatSitDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function durationSeconds(startedAtMs: number, endedAtMs: number = Date.now()): number {
  return Math.max(0, Math.floor((endedAtMs - startedAtMs) / 1000));
}