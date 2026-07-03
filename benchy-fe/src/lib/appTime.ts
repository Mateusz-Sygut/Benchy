export function elapsedWholeMinutes(startMs: number, nowMs: number = Date.now()): number {
  if (nowMs <= startMs) return 0;
  return Math.floor((nowMs - startMs) / 60_000);
}

export function addMinutesToTotal(currentTotal: number, minutes: number): number {
  return currentTotal + Math.max(0, minutes);
}
