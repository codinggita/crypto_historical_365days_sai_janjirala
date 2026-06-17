import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import CommandMenu from '../components/CommandMenu';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="app-layout">
      {/* Global command/search overlay */}
      <CommandMenu />

      {/* Background glow effects */}
      <div className="bg-glow"></div>
      <div className="bg-glow-right"></div>

      {/* Sidebar navigation */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Mobile background overlay */}
      {sidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 95
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content viewport */}
      <div className="app-content">
        <Navbar 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
          user={user}
          onLogout={logout}
        />
        <main className="main-viewport">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
