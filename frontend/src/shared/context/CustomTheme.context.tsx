import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

import { PaletteMode, ThemeProvider, useMediaQuery } from '@mui/material';

import { useTranslation } from '#shared/i18n/useTranslation';

import getTheme from '../../theme';

type ChangeThemeCallback = (mode: PaletteMode | 'auto') => void;

const getPreferredMode = (): PaletteMode | 'auto' => {
  const cachedMode = localStorage.getItem('theme-mode');
  switch (cachedMode) {
    case 'dark':
      return 'dark';
    case 'light':
      return 'light';
    default:
      return 'auto';
  }
};

const CustomThemeContext = createContext<ChangeThemeCallback | null>(null);

export function CustomThemeProvider({ children }: PropsWithChildren) {
  const { i18n } = useTranslation();
  const [preferredMode, setPreferredMode] = useState<PaletteMode | 'auto'>(
    getPreferredMode()
  );
  const systemMode = useMediaQuery('(prefers-color-scheme: dark)')
    ? 'dark'
    : 'light';
  const theme = useMemo(
    () =>
      getTheme(
        preferredMode === 'auto' ? systemMode : preferredMode,
        i18n.language
      ),
    [preferredMode, systemMode, i18n.language]
  );

  return (
    <CustomThemeContext.Provider value={setPreferredMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CustomThemeContext.Provider>
  );
}

export function useChangeTheme(): ChangeThemeCallback {
  const context = useContext(CustomThemeContext);

  if (!context) {
    throw new Error(
      'useChangeTheme must be used within an CustomThemeProvider'
    );
  }

  return context;
}
