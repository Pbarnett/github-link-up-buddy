export function combineDateTime(date: string, time: string): string {
  // If time lacks seconds, append ":00"
  if (!time.includes(':')) return `${date}T${time}`;
  if (time.split(':').length === 2) return `${date}T${time}:00`;
  return `${date}T${time}`;
}
