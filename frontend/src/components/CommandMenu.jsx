import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Compass, X, Command, Activity } from 'lucide-react';
import coinService from '../services/coinService';

const shortcuts = [
  { label: 'Go to Dashboard', path: '/' },
  { label: 'Go to Coins Directory', path: '/coins' },
  { label: 'Go to Compare Coins', path: '/compare' },
  { label: 'Go to Market Heatmap', path: '/heatmap' },
  { label: 'Go to Global Statistics', path: '/stats' },
  { label: 'Go to Performance Leaderboards', path: '/leaderboards' },
  { label: 'Go to Analytics Hub', path: '/analytics' },
  { label: 'Go to Portfolio Simulator', path: '/portfolio' },
  { label: 'Go to Predictions & Recommendations', path: '/predictions' },
  { label: 'Go to Risk Alerts', path: '/alerts' },
  { label: 'Go to Coin Reports', path: '/reports' },
  { label: 'Go to System Health & Maintenance', path: '/admin/maintenance' },
  { label: 'Go to Admin Control Center', path: '/admin' },
  { label: 'Go to Settings', path: '/settings' }
];

export default function CommandMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  
  // Dynamic assets list
  const [coinsList, setCoinsList] = useState([]);
  
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Fetch coins index for searching
  useEffect(() => {
    async function loadCoins() {
      try {
        const res = await coinService.getLatest();
        if (res.success && Array.isArray(res.data)) {
          setCoinsList(res.data);
        }
      } catch (err) {
        console.error('Failed to load command menu assets index:', err);
      }
    }
    if (isOpen) {
      loadCoins();
    }
  }, [isOpen]);

  // Filter shortcuts matching query
  const filteredShortcuts = shortcuts.filter(s =>
    s.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter coins matching query (only if query is not empty to avoid listing 100 items on start)
  const filteredCoins = searchQuery.trim() === '' ? [] : coinsList.filter(c =>
    c.coin_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.coin_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Unify results for keyboard index navigation
  const unifiedItems = [
    ...filteredShortcuts.map(s => ({ type: 'shortcut', label: s.label, path: s.path })),
    ...filteredCoins.map(c => ({ 
      type: 'coin', 
      label: `${c.coin_name} (${c.symbol.toUpperCase()})`, 
      path: `/coins/${c.coin_id}`,
      price: c.price
    }))
  ];

  const totalItems = unifiedItems.length;

  const handleSelect = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  // Close/Open keyboard triggers and index navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (!isOpen) return;

      if (e.key === 'Escape') {
        setIsOpen(false);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prev) => (totalItems > 0 ? (prev + 1) % totalItems : 0));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prev) => (totalItems > 0 ? (prev - 1 + totalItems) % totalItems : 0));
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (totalItems > 0 && unifiedItems[highlightedIndex]) {
          handleSelect(unifiedItems[highlightedIndex].path);
        }
      }
    };

    const handleOpenTrigger = () => {
      setIsOpen(true);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('open-command-menu', handleOpenTrigger);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('open-command-menu', handleOpenTrigger);
    };
  }, [isOpen, totalItems, highlightedIndex, unifiedItems]);

  // Focus input on open & reset state
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 50);
    } else {
      setSearchQuery('');
      setHighlightedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingTop: '15vh'
      }}
      onClick={() => setIsOpen(false)}
    >
      {/* Modal Container */}
      <div
        className="glass-panel"
        style={{
          width: '90%',
          maxWidth: '560px',
          background: 'rgba(20, 20, 28, 0.95)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          padding: 0,
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
          <Search size={18} color="var(--text-secondary)" />
          <input
            ref={inputRef}
            type="text"
            className="form-input"
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              padding: 0,
              fontSize: '15px',
              outline: 'none',
              boxShadow: 'none',
              color: '#fff'
            }}
            placeholder="Search coin assets or shortcuts... (Press ESC to close)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={() => setIsOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Shortcuts & Asset list container */}
        <div style={{ maxHeight: '350px', overflowY: 'auto', padding: '8px' }} className="custom-scroll">
          
          {/* Unified Items Rendering */}
          {totalItems === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
              No matches found for "{searchQuery}"
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              
              {/* If we have shortcuts */}
              {filteredShortcuts.length > 0 && (
                <>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', padding: '6px 10px', fontWeight: 600, letterSpacing: '0.5px' }}>
                    Navigation Shortcuts
                  </div>
                  {filteredShortcuts.map((item, index) => {
                    const globalIndex = index;
                    const isHighlighted = highlightedIndex === globalIndex;
                    return (
                      <div
                        key={item.path}
                        onClick={() => handleSelect(item.path)}
                        onMouseEnter={() => setHighlightedIndex(globalIndex)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          background: isHighlighted ? 'var(--primary)' : 'none',
                          color: isHighlighted ? '#fff' : 'var(--text-secondary)',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        <Command size={14} color={isHighlighted ? '#fff' : 'var(--text-muted)'} />
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>{item.label}</span>
                      </div>
                    );
                  })}
                </>
              )}

              {/* If we have matching coins */}
              {filteredCoins.length > 0 && (
                <>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', padding: '12px 10px 6px 10px', fontWeight: 600, letterSpacing: '0.5px' }}>
                    Matching Catalog Assets
                  </div>
                  {filteredCoins.map((item, index) => {
                    const globalIndex = filteredShortcuts.length + index;
                    const isHighlighted = highlightedIndex === globalIndex;
                    return (
                      <div
                        key={item.coin_id}
                        onClick={() => handleSelect(`/coins/${item.coin_id}`)}
                        onMouseEnter={() => setHighlightedIndex(globalIndex)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          background: isHighlighted ? 'var(--primary)' : 'none',
                          color: isHighlighted ? '#fff' : 'var(--text-secondary)',
                          transition: 'background 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <Activity size={14} color={isHighlighted ? '#fff' : 'var(--primary-hover)'} />
                          <span style={{ fontSize: '13px', fontWeight: 600 }}>{item.coin_name}</span>
                          <span style={{ fontSize: '10px', color: isHighlighted ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)', textTransform: 'uppercase' }}>
                            {item.symbol}
                          </span>
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: isHighlighted ? '#fff' : 'var(--primary-hover)' }}>
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price)}
                        </span>
                      </div>
                    );
                  })}
                </>
              )}

            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', background: 'rgba(255,255,255,0.01)', borderTop: '1px solid var(--border-color)', fontSize: '10px', color: 'var(--text-muted)' }}>
          <span>Navigate with ↑↓ and Enter</span>
          <span>Open with Ctrl+K</span>
        </div>
      </div>
    </div>
  );
}
