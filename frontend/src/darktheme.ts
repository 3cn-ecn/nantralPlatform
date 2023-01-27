import { createTheme } from '@mui/material/styles';

const darktheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#dc3545',
    },
    secondary: {
      main: '#efefef',
    },
    button: {
      main: '0d6efd',
    },
    warning: {
      main: '#dc3545',
    },
    info: {
      main: '#0d6efd',
    },
    background: {
      default: '#696969',
      paper: '#696767',
    },
    text: {
      primary: '#fff',
    },
  },
  overrides: {
    MuiAppBar: {
      colorInherit: {
        backgroundColor: '#689f38',
        color: '#fff',
      },
    },
  },
  props: {
    MuiAppBar: {
      color: 'secondary',
    },
  },
});

export default darktheme;
