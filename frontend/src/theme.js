import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#f3f3f3',
    },
    secondary: {
      main: '#dc3545',
    },
    warning: {
      main: '#ffc107',
    },
    info: {
      main: '#0d6efd',
    },
    text: {
      primary: 'rgba(255,0,0,0.87)',
      secondary: 'rgba(10,0,0,0.54)',
    },
  },
});

export default theme;
