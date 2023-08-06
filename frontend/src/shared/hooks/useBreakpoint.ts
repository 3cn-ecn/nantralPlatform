import { Breakpoint, useMediaQuery, useTheme } from '@mui/material';

export function useBreakpoint(breakpoint: Breakpoint | number = 'sm') {
  const theme = useTheme();
  const isSmaller = useMediaQuery(theme.breakpoints.down(breakpoint));
  const isLarger = useMediaQuery(theme.breakpoints.up(breakpoint));

  return { isSmaller, isLarger };
}
