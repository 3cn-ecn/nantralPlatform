import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { PaletteMode, ThemeProvider, useMediaQuery } from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';

import getTheme from '../../theme';

type ChangeThemeCallback = {
  changeThemeMode: (mode: PaletteMode | 'auto') => void;
  themeMode: PaletteMode | 'auto';
};

const getCachedThemeMode = (): PaletteMode | 'auto' => {
  const mode = localStorage.getItem('theme-mode');
  if (mode === 'light' || mode === 'dark') {
    return mode;
  }
  return 'auto';
};

const CustomThemeContext = createContext<ChangeThemeCallback | null>(null);

export function CustomThemeProvider({ children }: PropsWithChildren) {
  const { i18n } = useTranslation();
  const [themeMode, setThemeMode] = useState<PaletteMode | 'auto'>(
    getCachedThemeMode()
  );

  const systemThemeMode = useMediaQuery('(prefers-color-scheme: dark)')
    ? 'dark'
    : 'light';

  const theme = useMemo(
    () =>
      getTheme(
        themeMode === 'auto' ? systemThemeMode : themeMode,
        i18n.language
      ),
    [themeMode, systemThemeMode, i18n.language]
  );

  const changeThemeMode = useCallback(
    (mode: PaletteMode | 'auto') => {
      setThemeMode(mode);
      localStorage.setItem('theme-mode', mode);
    },
    [setThemeMode]
  );

  const customThemeContextValue = useMemo(
    () => ({
      changeThemeMode,
      themeMode,
    }),
    [themeMode, changeThemeMode]
  );

  return (
    <CustomThemeContext.Provider value={customThemeContextValue}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CustomThemeContext.Provider>
  );
}

export function useChangeThemeMode(): ChangeThemeCallback {
  const context = useContext(CustomThemeContext);

  if (!context) {
    throw new Error(
      'useChangeTheme must be used within an CustomThemeProvider'
    );
  }

  return context;
}
