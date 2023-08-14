import { PaletteMode, createTheme, responsiveFontSizes } from '@mui/material';
import { enUS, frFR } from '@mui/x-date-pickers';

import { languages } from '#shared/i18n/config';

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
          main: mode === 'light' ? '#dc3545' : '#FF3E51',
        },
        secondary: {
          main: mode === 'light' ? '#536873' : '#99AEB8',
        },
        neutral: {
          main: '#efefef',
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
          default: mode == 'light' ? '#FFFFFF' : '#1A1A1A',
          paper: mode === 'light' ? '#FCFCFC' : '#262626',
        },
      },
      typography: {
        fontFamily: 'Heebo, sans-serif',
        fontWeightLight: 300,
        fontWeightBold: 600,
        poster: {
          fontWeight: 800,
          fontSize: '6rem',
          lineHeight: 1.167,
        },
        h1: {
          fontWeight: 800,
          fontSize: '3.5rem',
        },
        h2: {
          fontWeight: 600,
          fontSize: '3rem',
        },
        h3: {
          fontWeight: 600,
          fontSize: '2.125rem',
        },
        h4: {
          fontWeight: 500,
          fontSize: '1.5rem',
        },
        h5: {
          fontWeight: 500,
          fontSize: '1.25rem',
        },
        h6: {
          fontWeight: 400,
        },
        body2: {
          fontWeight: 400,
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
    muiDatePickerLocale
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
  }
  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
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
