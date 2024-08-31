import { createTheme, ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#1976d2', // Blue color for primary elements
    },
    secondary: {
      main: '#4caf50', // Green color for secondary elements
    },
    background: {
      default: '#f5f5f5', // Light background color
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 600,
      marginBottom: '1rem',
    },
    h5: {
      fontWeight: 500,
      marginBottom: '0.5rem',
    },
    h6: {
      fontWeight: 400,
      marginBottom: '0.5rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
};

const theme = createTheme(themeOptions);

export default theme;
