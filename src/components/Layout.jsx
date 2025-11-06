import React from 'react';
import { Outlet, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from './context/authContext';

// MUI Imports
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Container,
} from '@mui/material';

const Layout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar component="nav">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/dashboard"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            SlotSwapper
          </Typography>
          <Box>
            <Button sx={{ color: '#fff' }} component={RouterLink} to="/dashboard">
              My Events
            </Button>
            <Button sx={{ color: '#fff' }} component={RouterLink} to="/marketplace">
              Marketplace
            </Button>
            <Button sx={{ color: '#fff' }} component={RouterLink} to="/requests">
              Requests
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ p: 3, width: '100%' }}>
        <Toolbar /> {/* This is a spacer for under the AppBar */}
        <Outlet /> {/* This renders the child route (Dashboard, Marketplace, etc.) */}
      </Container>
    </Box>
  );
};

export default Layout;