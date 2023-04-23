import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#dc3545',
    },
    secondary: {
      main: '#efefef',
      light: '#fff',
    },
    warning: {
      main: '#dc3545',
    },
    info: {
      main: '#0d6efd',
    },
    neutral: {
      main: '#dbdbdb',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {},
      },
    },
  },
  status: { danger: '' },
});

export default theme;
