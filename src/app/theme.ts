'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#CB997E', // Your custom primary color (e.g., deep orange)
      light: '#DDBEA8',
      dark: '#9A7B67',
      contrastText: '#fff',
    },
    secondary: {
      main: '#C7CDAA', // Your custom secondary color (e.g., green)
    },
  },
  typography: {
    //fontFamily: 'var(--font-roboto)',
    fontFamily: "Cormorant Garamond"
  },
  cssVariables: true
});

export default theme;
