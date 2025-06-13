
/**
 * Utility function to get human-friendly pool display names based on mode
 */
export function getPoolDisplayName(
  mode: 'manual' | 'auto',
  pool: 1 | 2 | 3
): string {
  const names = {
    manual: ['Best Value', 'Low Cost', 'Premium'],
    auto: ['Perfect', 'Close', 'Backup']
  };
  return names[mode][pool - 1];
}
