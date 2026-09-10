export function getSessionDuration(startTime, endTime) {
  const start = Number(startTime);
  const end = Number(endTime);
  if (!start || !end || end <= start) {
    console.warn(
      `[getSessionDuration] Guard triggered: start=${start}, end=${end}. Returning 0 to prevent negative duration.`
    );
    return 0;
  }
  return end - start;
}

export function minutesToUnits(minutes) {
  const safe = Math.max(0, minutes || 0);
  return Number((safe / 600).toFixed(2));
}
