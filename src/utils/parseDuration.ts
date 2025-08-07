export function parseDuration(isoStr: string): string {
  const match = isoStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return ''; // fallback if not ISO
  const hours = match[1] ? parseInt(match[1], 10) : 0;
  const minutes = match[2] ? parseInt(match[2], 10) : 0;
  let result = '';
  if (hours > 0) result += `${hours}h`;
  if (minutes > 0) {
    if (hours > 0) result += ' ';
    result += `${minutes}m`;
  }
  return result || '0m';
}
