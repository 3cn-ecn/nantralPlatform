import { PaletteMode, createTheme, responsiveFontSizes } from '@mui/material';

function getTheme(mode: PaletteMode) {
  const theme = createTheme({
    palette: {
      mode: mode,
      primary: {
        main: '#dc3545',
      },
      secondary: {
        main: '#607d8b',
        light: '#fff',
      },
      neutral: {
        main: '#efefef',
      },
      warning: {
        main: '#ffc107',
      },
      info: {
        main: '#0288d1',
      },
      error: {
        main: '#d84315',
      },
    },
    typography: {
      fontFamily: 'Heebo, sans-serif',
      fontWeightLight: 300,
      fontWeightBold: 800,
      h1: {
        fontWeight: 600,
      },
      h2: {
        fontSize: '3rem',
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 500,
      },
      h5: {
        fontWeight: 500,
      },
      h6: {
        fontWeight: 400,
      },
      body2: {
        fontWeight: 400,
      },
      button: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 20,
    },
    overrides: {
      MuiSwitch: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          margin: 8,
        },
        switchBase: {
          padding: 1,
          '&$checked, &$colorPrimary$checked, &$colorSecondary$checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + $track': {
              opacity: 1,
              border: 'none',
            },
          },
        },
        thumb: {
          width: 24,
          height: 24,
        },
        track: {
          borderRadius: 13,
          border: '1px solid #bdbdbd',
          backgroundColor: '#fafafa',
          opacity: 1,
          transition:
            'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        },
      },
    },
  });

  return responsiveFontSizes(theme);
}

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
  }

  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
  }

  interface ThemeOptions {
    overrides: object;
  }
}

export default getTheme;
