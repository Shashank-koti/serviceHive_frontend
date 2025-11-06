import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SIgnupPage';
import DashboardPage from './components/pages/DashboardPage';
import Layout from './components/Layout';
import MarketplacePage from './components/pages/MarketplacePage'; // <-- Import
import RequestsPage from './components/pages/RequestsPage'; // <-- Import

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout><Outlet/></Layout>}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/marketplace" element={<MarketplacePage />} /> 
          <Route path="/requests" element={<RequestsPage />} /> 
        </Route>
      </Route>

      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}

export default App;