import { useMediaQuery } from '@mui/material';

export function useDesktopMode() {
  return useMediaQuery('@media (pointer: fine)');
}
