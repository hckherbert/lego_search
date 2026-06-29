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
    text: {
      primary: '#1a1a1a',    
      secondary: '#4a4a4a',  
    },
  },
  typography: {
    //fontFamily: 'var(--font-roboto)',
    fontFamily: "Cormorant Garamond",
    fontSize: 16, // MUI default is 14
    htmlFontSize: 16,
    body1: {
      lineHeight: 1
    }
  },
  cssVariables: true
});

export default theme;
