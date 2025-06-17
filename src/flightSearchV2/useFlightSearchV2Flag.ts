export const useFlightSearchV2Flag = (): boolean => {
  return import.meta.env.VITE_FLAG_FS_V2 === 'true';
};
