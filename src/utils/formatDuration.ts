
/**
 * Converts ISO 8601 duration format (PT1H13M) to human readable format (1h 13m)
 */
export function formatDuration(iso: string): string {
  if (!iso) return '';
  
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return iso; // Return original if parsing fails
  
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  
  if (hours === 0 && minutes === 0) return '';
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  
  return `${hours}h ${minutes}m`;
}
