// Helper to modify import.meta.env for testing purposes
export const setEnv = (key: string, value: string): (() => void) => {
  const oldValue = import.meta.env[key];
  // Type assertion to bypass read-only nature of import.meta.env
  (import.meta as { env: Record<string, string> }).env[key] = value;

  // Return a function to restore the original value
  return () => {
    (import.meta as { env: Record<string, string> }).env[key] = oldValue;
  };
};
