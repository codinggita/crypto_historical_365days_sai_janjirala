import React from 'react';
import { Menu, Search, User, LogOut, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Layout.css';

export default function Navbar({ onMenuToggle, user, onLogout }) {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <button 
          className="menu-toggle" 
          onClick={onMenuToggle}
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        <div 
          className="navbar-search-container"
          onClick={() => window.dispatchEvent(new CustomEvent('open-command-menu'))}
          style={{ cursor: 'pointer', position: 'relative' }}
        >
          <Search className="navbar-search-icon" />
          <input 
            type="text" 
            placeholder="Search catalog..." 
            className="form-input navbar-search"
            readOnly
            style={{ cursor: 'pointer', paddingRight: '60px' }}
          />
          <kbd style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--border-color)',
            borderRadius: '4px',
            padding: '2px 6px',
            fontSize: '10px',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-sans)',
            pointerEvents: 'none'
          }}>Ctrl K</kbd>
        </div>
      </div>

      <div className="navbar-right">
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link to="/profile" className="user-profile-widget" style={{ textDecoration: 'none' }}>
              <div className="user-avatar">
                {user.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
              </div>
              <span>{user.name}</span>
            </Link>
            <button 
              onClick={onLogout} 
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', marginLeft: '4px' }}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>
              <LogIn size={14} />
              <span>Login</span>
            </Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '13px' }}>
              <span>Sign Up</span>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
