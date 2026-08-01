import { PaletteMode, createTheme, responsiveFontSizes } from '@mui/material';
import { enUS, frFR } from '@mui/x-date-pickers';

import { languages } from '#shared/i18n/config';

const brandColors = {
  primary: '#004e9f',
  primaryDark: '#003f82',
  primarySoft: '#d7e3ff',
  primarySoftHover: '#c8dbff',
  sidebarGlass: 'rgba(255, 255, 255, 0.55)',
  sidebarGlassBorder: 'rgba(255, 255, 255, 0.36)',
  sidebarBackground: '#eef2f7',
  sidebarBackgroundAlt: '#e7ebf2',
  sidebarHover: '#e5eaf2',
  sidebarBorder: 'rgba(16, 24, 40, 0.06)',
  sidebarInsetBorder: 'rgba(255, 255, 255, 0.62)',
  cardBorder: 'rgba(16, 24, 40, 0.06)',
  cardBackground: '#ffffff',
  mutedText: '#364152',
  secondaryText: '#667085',
  pageBackground: '#eef2f8',
  pageBackgroundAlt: '#e9edf5',
} as const;

const mapLocales: Record<(typeof languages)[number], typeof enUS> = {
  'fr-FR': frFR,
  'en-GB': enUS,
  'en-US': enUS,
};

function getTheme(mode: PaletteMode, language: string) {
  const muiDatePickerLocale: typeof enUS = mapLocales[language] || enUS;

  const theme = createTheme(
    {
      palette: {
        mode: mode,
        primary: {
          main: mode === 'light' ? brandColors.primary : '#00346b',
        },
        secondary: {
          main: mode === 'light' ? '#6e6e73' : '#99AEB8',
        },
        neutral: {
          main: '#ffffff',
        },
        warning: {
          main: '#ffc107',
        },
        info: {
          main: '#0288D1',
        },
        error: {
          main: mode === 'light' ? '#C15700' : '#FF7E15',
        },
        background: {
          default: mode == 'light' ? brandColors.pageBackground : '#1A1A1A',
          paper: mode === 'light' ? brandColors.cardBackground : '#262626',
        },
        appShell: {
          background: brandColors.pageBackground,
          backgroundAlt: brandColors.pageBackgroundAlt,
          sidebarGlass: brandColors.sidebarGlass,
          sidebarGlassBorder: brandColors.sidebarGlassBorder,
          sidebarBackground: brandColors.sidebarBackground,
          sidebarBackgroundAlt: brandColors.sidebarBackgroundAlt,
          sidebarBorder: brandColors.sidebarBorder,
          sidebarInsetBorder: brandColors.sidebarInsetBorder,
          sidebarHover: brandColors.sidebarHover,
          sidebarActive: brandColors.primarySoft,
          sidebarActiveHover: 'rgba(215, 227, 255, 0.9)',
          sidebarText: brandColors.mutedText,
          sidebarActiveText: brandColors.primary,
          cardBorder: brandColors.cardBorder,
          cardBackground: brandColors.cardBackground,
          secondaryText: brandColors.secondaryText,
          primaryDark: brandColors.primaryDark,
        },
      },
      typography: {
        // px units are automatically converted into rem by MUI
        fontFamily: 'Heebo, sans-serif',
        fontWeightLight: 300,
        fontWeightBold: 600,
        poster: {
          fontWeight: 800,
          fontSize: 96,
          lineHeight: 1.167,
        },
        h1: {
          fontWeight: 800,
          fontSize: 48,
        },
        h2: {
          fontWeight: 700,
          fontSize: 34,
        },
        h3: {
          fontWeight: 600,
          fontSize: 28,
        },
        h4: {
          textTransform: 'uppercase',
          fontWeight: 550,
          fontSize: 24,
        },
        h5: {
          fontWeight: 500,
          fontSize: 20,
        },
        h6: {
          textTransform: 'uppercase',
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: '0.08em'
        },
        body2: {
          fontWeight: 400,
          fontSize: 13,
          lineHeight: 1.6
        },
        button: {
          fontWeight: 500,
        },
      },
      shape: {
        borderRadius: 20,
      },
      components: {
        MuiButton: {
          defaultProps: {
            disableElevation: true,
          },
        },
        MuiAppBar: {
          defaultProps: {
            color: 'transparent',
            elevation: 0,
            opacity: 0.2,
          },
          styleOverrides: {
            root: {
              backdropFilter: 'blur(20px)',
            },
          },
        },
        MuiCard: {
          defaultProps: {
            variant: 'outlined',
          },
        },
        MuiTypography: {
          defaultProps: {
            variantMapping: {
              // Map the new variant to render a <h1> by default
              poster: 'h1',
            },
          },
        },
      },
    },
    muiDatePickerLocale,
  );

  return responsiveFontSizes(theme, {
    variants: [
      'poster',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'subtitle1',
      'subtitle2',
      'body1',
      'body2',
      'caption',
      'button',
      'overline',
    ],
  });
}

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
    appShell: {
      background: string;
      backgroundAlt: string;
      sidebarGlass: string;
      sidebarGlassBorder: string;
      sidebarBackground: string;
      sidebarBackgroundAlt: string;
      sidebarBorder: string;
      sidebarInsetBorder: string;
      sidebarHover: string;
      sidebarActive: string;
      sidebarActiveHover: string;
      sidebarText: string;
      sidebarActiveText: string;
      cardBorder: string;
      cardBackground: string;
      secondaryText: string;
      primaryDark: string;
    };
  }
  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
    appShell?: {
      background?: string;
      backgroundAlt?: string;
      sidebarGlass?: string;
      sidebarGlassBorder?: string;
      sidebarBackground?: string;
      sidebarBackgroundAlt?: string;
      sidebarBorder?: string;
      sidebarInsetBorder?: string;
      sidebarHover?: string;
      sidebarActive?: string;
      sidebarActiveHover?: string;
      sidebarText?: string;
      sidebarActiveText?: string;
      cardBorder?: string;
      cardBackground?: string;
      secondaryText?: string;
      primaryDark?: string;
    };
  }
  interface TypographyVariants {
    poster: React.CSSProperties;
  }
  interface TypographyVariantsOptions {
    poster?: React.CSSProperties;
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    poster: true;
  }
}

export default getTheme;
