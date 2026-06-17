import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';

import { AuthProvider } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';
import ProtectedRoute from './components/ProtectedRoute';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Coins from './pages/Coins';
import CoinDetails from './pages/CoinDetails';
import Compare from './pages/Compare';
import Heatmap from './pages/Heatmap';
import Stats from './pages/Stats';
import Analytics from './pages/Analytics';
import Portfolio from './pages/Portfolio';
import Predictions from './pages/Predictions';
import Admin from './pages/Admin';
import Maintenance from './pages/Maintenance';

function PagePlaceholder({ title }) {
  return (
    <div className="glass-panel" style={{ padding: '40px', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '24px', marginBottom: '8px' }}>{title} Page</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>This section is currently under construction and will be implemented in a subsequent PR step.</p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="coins" element={<Coins />} />
            <Route path="coins/:id" element={<CoinDetails />} />
            <Route path="compare" element={<Compare />} />
            <Route path="heatmap" element={<Heatmap />} />
            <Route path="stats" element={<Stats />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="predictions" element={<Predictions />} />
            <Route path="admin" element={
              <ProtectedRoute adminOnly>
                <Admin />
              </ProtectedRoute>
            } />
            <Route path="admin/maintenance" element={
              <ProtectedRoute adminOnly>
                <Maintenance />
              </ProtectedRoute>
            } />
            <Route path="profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="settings" element={<PagePlaceholder title="Settings" />} />
            <Route path="*" element={<PagePlaceholder title="404 Not Found" />} />
          </Route>
          
          {/* Authentication Pages (Full Viewport) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
