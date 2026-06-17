import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  ArrowLeftRight, 
  Grid, 
  BarChart3, 
  PieChart, 
  LineChart, 
  ShieldAlert, 
  Settings, 
  X,
  Sparkles
} from 'lucide-react';
import './Layout.css';

const menuItems = [
  { path: '/', name: 'Dashboard', icon: Home },
  { path: '/coins', name: 'Coins Directory', icon: TrendingUp },
  { path: '/compare', name: 'Compare Coins', icon: ArrowLeftRight },
  { path: '/heatmap', name: 'Market Heatmap', icon: Grid },
  { path: '/stats', name: 'Global Statistics', icon: BarChart3 },
  { path: '/analytics', name: 'Analytics Hub', icon: LineChart },
  { path: '/portfolio', name: 'Portfolio Simulator', icon: PieChart },
  { path: '/predictions', name: 'Predictions & Recs', icon: Sparkles },
  { path: '/admin', name: 'Admin Panel', icon: ShieldAlert },
  { path: '/settings', name: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-logo">C</div>
        <span className="sidebar-title">CryptoSphere</span>
        {onClose && (
          <button 
            className="menu-toggle" 
            style={{ display: 'block', marginLeft: 'auto' }} 
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-item-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <p>© 2026 CryptoSphere</p>
        <p style={{ fontSize: '10px', marginTop: '4px' }}>v1.0.0</p>
      </div>
    </aside>
  );
}
