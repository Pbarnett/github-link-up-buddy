/**
 * Formats a number as a localized currency string.
 * Returns 'N/A' for invalid or non-finite inputs.
 * @param amount Amount in major currency units
 * @param currency ISO currency code, e.g. 'USD'
 */
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  if (typeof amount !== 'number' || !isFinite(amount)) return 'N/A';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
};
