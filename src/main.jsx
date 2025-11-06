import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from "./components/context/authContext.jsx";

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

// A simple default theme
const theme = createTheme({
  palette: {
    mode: 'light', // Or 'dark'
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Resets CSS for consistency */}
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);