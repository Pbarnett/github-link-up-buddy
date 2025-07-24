export function formatLocalDateTime(isoStr: string): string {
  const dt = new Date(isoStr);
  return new Intl.DateTimeFormat(undefined, {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(dt);
}
