
// Stub implementation for feature flags
// Will be replaced with real SWR + Edge Function implementation in Phase 1
export const useFeatureFlag = (flag: string): boolean => {
  // Until real back-end flag exists, always return false
  // This ensures the legacy auto-booking toggle is hidden
  return false;
};
