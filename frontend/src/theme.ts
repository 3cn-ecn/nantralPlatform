import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#dc3545',
    },
    secondary: {
      main: '#efefef',
    },
    info: {
      main: 'dc3545',
    },
    warning: {
      main: '#dc3545',
    },
    info: {
      main: '#0d6efd',
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

export default theme;
