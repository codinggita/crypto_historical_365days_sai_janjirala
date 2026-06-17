import React, { useState, useEffect } from 'react';
import coinService from '../services/coinService';
import { Shield, Plus, Edit2, Trash2, Database, Upload, Download, FileJson, AlertTriangle, Loader2, CheckCircle } from 'lucide-react';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('assets'); // 'assets' or 'bulk'
  const [coins, setCoins] = useState([]);
  const [loadingCoins, setLoadingCoins] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form states for creating a new coin
  const [newCoin, setNewCoin] = useState({
    coin_id: '',
    coin_name: '',
    symbol: '',
    price: '',
    market_cap: '',
    volume: '',
    circulating_supply: '',
    market_cap_rank: ''
  });

  // Edit states
  const [editingCoin, setEditingCoin] = useState(null);
  const [editPrice, setEditPrice] = useState('');

  // Bulk & Export states
  const [bulkJsonText, setBulkJsonText] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    async function loadCoins() {
      try {
        const res = await coinService.getLatest();
        if (res.success && Array.isArray(res.data)) {
          setCoins(res.data);
        } else {
          setError('Failed to fetch coin directories.');
        }
      } catch (err) {
        console.error('Error fetching admin coin directory:', err);
        setError('Error loading coin directory.');
      } finally {
        setLoadingCoins(false);
      }
    }
    loadCoins();
  }, []);

  const handleCreateCoin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      const payload = {
        coin_id: newCoin.coin_id,
        coin_name: newCoin.coin_name,
        symbol: newCoin.symbol,
        price: parseFloat(newCoin.price) || 0,
        market_cap: parseFloat(newCoin.market_cap) || 0,
        volume: parseFloat(newCoin.volume) || 0,
        circulating_supply: parseFloat(newCoin.circulating_supply) || 0,
        market_cap_rank: parseInt(newCoin.market_cap_rank) || undefined
      };
      const res = await coinService.createCoin(payload);
      if (res.success) {
        setSuccessMsg(`Asset "${payload.coin_name}" created successfully!`);
        setCoins([res.data, ...coins]);
        setNewCoin({
          coin_id: '',
          coin_name: '',
          symbol: '',
          price: '',
          market_cap: '',
          volume: '',
          circulating_supply: '',
          market_cap_rank: ''
        });
      } else {
        setError(res.message || 'Failed to create asset.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred while creating asset.');
    }
  };

  const handleUpdateCoin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      const payload = {
        price: parseFloat(editPrice) || 0
      };
      const res = await coinService.updateCoin(editingCoin.coin_id, payload);
      if (res.success) {
        setSuccessMsg(`Asset "${editingCoin.coin_name}" updated successfully!`);
        setCoins(coins.map(c => c.coin_id === editingCoin.coin_id ? res.data : c));
        setEditingCoin(null);
      } else {
        setError(res.message || 'Failed to update asset.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred while updating asset.');
    }
  };

  const handleDeleteCoin = async (coinId) => {
    if (!window.confirm(`Are you sure you want to delete asset "${coinId}"?`)) return;
    setError('');
    setSuccessMsg('');
    try {
      const res = await coinService.deleteCoin(coinId);
      if (res.success) {
        setSuccessMsg(`Asset "${coinId}" deleted successfully!`);
        setCoins(coins.filter(c => c.coin_id !== coinId));
      } else {
        setError(res.message || 'Failed to delete asset.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred while deleting asset.');
    }
  };

  const handleBulkCreate = async () => {
    if (!bulkJsonText.trim()) {
      setError('Please enter a JSON array containing coin records.');
      return;
    }
    setError('');
    setSuccessMsg('');
    setBulkLoading(true);
    try {
      const parsed = JSON.parse(bulkJsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('Input must be a valid JSON array of coin records.');
      }
      const res = await coinService.bulkCreate(parsed);
      if (res.success) {
        setSuccessMsg(`Successfully bulk-created ${parsed.length} assets!`);
        setBulkJsonText('');
        // Refresh table
        const latestRes = await coinService.getLatest();
        if (latestRes.success && Array.isArray(latestRes.data)) {
          setCoins(latestRes.data);
        }
      } else {
        setError(res.message || 'Bulk creation failed.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to parse or process bulk payload. Make sure it is a valid JSON array.');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkUpdate = async () => {
    if (!bulkJsonText.trim()) {
      setError('Please enter a JSON array containing coin records to update.');
      return;
    }
    setError('');
    setSuccessMsg('');
    setBulkLoading(true);
    try {
      const parsed = JSON.parse(bulkJsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('Input must be a valid JSON array of coin records.');
      }
      const res = await coinService.bulkUpdate(parsed);
      if (res.success) {
        setSuccessMsg(`Successfully bulk-updated ${parsed.length} assets!`);
        setBulkJsonText('');
        // Refresh table
        const latestRes = await coinService.getLatest();
        if (latestRes.success && Array.isArray(latestRes.data)) {
          setCoins(latestRes.data);
        }
      } else {
        setError(res.message || 'Bulk update failed.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to parse or process bulk payload. Make sure it is a valid JSON array.');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleExportJson = async () => {
    setError('');
    setSuccessMsg('');
    try {
      const res = await coinService.exportJson();
      const jsonStr = JSON.stringify(res, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `crypto_catalog_export_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSuccessMsg('JSON catalog database exported successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to export catalog JSON.');
    }
  };

  const handleExportCsv = async () => {
    setError('');
    setSuccessMsg('');
    try {
      const data = await coinService.exportCsv();
      const url = URL.createObjectURL(new Blob([data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `crypto_catalog_export_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSuccessMsg('CSV catalog database exported successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to export catalog CSV.');
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={28} color="var(--danger)" />
            <span>Administrative Control Center</span>
          </h1>
          <p className="page-subtitle">Manage catalog assets, update prices, run bulk tools, and export system database.</p>
        </div>

        {/* Tab triggers */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveTab('assets')}
            style={{
              background: activeTab === 'assets' ? 'var(--primary)' : 'none',
              border: 'none',
              color: activeTab === 'assets' ? '#fff' : 'var(--text-secondary)',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            Asset Directory
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            style={{
              background: activeTab === 'bulk' ? 'var(--primary)' : 'none',
              border: 'none',
              color: activeTab === 'bulk' ? '#fff' : 'var(--text-secondary)',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            Bulk & Export Utilities
          </button>
        </div>
      </div>

      {error && (
        <div className="glass-panel" style={{ padding: '16px', borderColor: 'rgba(244, 63, 94, 0.3)', background: 'var(--danger-glow)', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="glass-panel" style={{ padding: '16px', borderColor: 'rgba(16, 185, 129, 0.3)', background: 'var(--success-glow)', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {activeTab === 'assets' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px', alignItems: 'start' }}>
          {/* Left: Coin List Table */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={20} color="var(--primary-hover)" />
              <span>Catalog Assets</span>
            </h2>

            {loadingCoins ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', gap: '10px' }}>
                <Loader2 className="pulsing-glow spinning" size={32} color="var(--primary)" />
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Retrieving asset inventory...</span>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                      <th style={{ padding: '10px' }}>ID / Name</th>
                      <th style={{ padding: '10px' }}>Symbol</th>
                      <th style={{ padding: '10px', textAlign: 'right' }}>Price</th>
                      <th style={{ padding: '10px', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coins.map((coin) => (
                      <tr key={coin.coin_id} style={{ borderBottom: '1px solid var(--border-color)', color: '#fff' }}>
                        <td style={{ padding: '12px 10px' }}>
                          <div style={{ fontWeight: 600 }}>{coin.coin_name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{coin.coin_id}</div>
                        </td>
                        <td style={{ padding: '12px 10px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{coin.symbol}</td>
                        <td style={{ padding: '12px 10px', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(coin.price)}</td>
                        <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              onClick={() => {
                                setEditingCoin(coin);
                                setEditPrice(coin.price);
                              }}
                              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                              onMouseEnter={e => e.currentTarget.style.color = 'var(--primary-hover)'}
                              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteCoin(coin.coin_id)}
                              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                              onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
                              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right: Create or Edit Forms */}
          <div>
            {!editingCoin ? (
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Plus size={18} color="var(--success)" />
                  <span>Create Asset</span>
                </h2>
                <form onSubmit={handleCreateCoin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '10px' }}>Coin ID (unique-identifier)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. bitcoin" 
                      value={newCoin.coin_id}
                      onChange={e => setNewCoin({...newCoin, coin_id: e.target.value})}
                      required 
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '10px' }}>Coin Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Bitcoin" 
                      value={newCoin.coin_name}
                      onChange={e => setNewCoin({...newCoin, coin_name: e.target.value})}
                      required 
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '10px' }}>Symbol</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. BTC" 
                      value={newCoin.symbol}
                      onChange={e => setNewCoin({...newCoin, symbol: e.target.value})}
                      required 
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '10px' }}>Price ($)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="0.00" 
                      step="any" 
                      value={newCoin.price}
                      onChange={e => setNewCoin({...newCoin, price: e.target.value})}
                      required 
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '10px' }}>Market Cap ($)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="0" 
                      value={newCoin.market_cap}
                      onChange={e => setNewCoin({...newCoin, market_cap: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '10px' }}>Volume ($)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="0" 
                      value={newCoin.volume}
                      onChange={e => setNewCoin({...newCoin, volume: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '10px' }}>Supply</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="0" 
                      value={newCoin.circulating_supply}
                      onChange={e => setNewCoin({...newCoin, circulating_supply: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="form-label" style={{ fontSize: '10px' }}>Rank</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      placeholder="e.g. 1" 
                      value={newCoin.market_cap_rank}
                      onChange={e => setNewCoin({...newCoin, market_cap_rank: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                    <Plus size={16} />
                    <span>Create Asset</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px', borderColor: 'rgba(95, 82, 255, 0.4)' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Edit2 size={18} color="var(--primary-hover)" />
                  <span>Edit {editingCoin.coin_name}</span>
                </h2>
                <form onSubmit={handleUpdateCoin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label className="form-label" style={{ fontSize: '10px' }}>Price ($)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={editPrice} 
                      onChange={e => setEditPrice(e.target.value)}
                      step="any" 
                      required 
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                      Save
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setEditingCoin(null)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'bulk' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px', alignItems: 'start' }}>
          
          {/* Left: Bulk Input JSON Paste */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Upload size={20} color="var(--primary-hover)" />
                <span>Bulk Catalog Creator & Updater</span>
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Paste a raw JSON array of coin asset entries. Fields required for bulk creation include coin_id, coin_name, symbol, and price.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <textarea
                className="form-input"
                style={{ minHeight: '220px', fontFamily: 'var(--font-mono)', fontSize: '12px', resize: 'vertical' }}
                placeholder='[&#10;  {&#10;    "coin_id": "solana",&#10;    "coin_name": "Solana",&#10;    "symbol": "sol",&#10;    "price": 145.20&#10;  }&#10;]'
                value={bulkJsonText}
                onChange={e => setBulkJsonText(e.target.value)}
                disabled={bulkLoading}
              />

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  onClick={handleBulkCreate}
                  disabled={bulkLoading}
                >
                  {bulkLoading ? <Loader2 className="spinning" size={14} /> : <Plus size={14} />}
                  <span>Bulk Create</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={handleBulkUpdate}
                  disabled={bulkLoading}
                >
                  {bulkLoading ? <Loader2 className="spinning" size={14} /> : <Upload size={14} />}
                  <span>Bulk Update</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Database Export Hub */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Download size={18} color="var(--success)" />
                <span>Catalog Export Hub</span>
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Download the complete active coin records database in structured formats.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* Export JSON Card */}
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '14px 16px', 
                  background: 'rgba(255,255,255,0.02)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-sm)' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileJson size={20} color="var(--primary-hover)" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>JSON Format</span>
                </div>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  onClick={handleExportJson}
                >
                  <span>Export</span>
                </button>
              </div>

              {/* Export CSV Card */}
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '14px 16px', 
                  background: 'rgba(255,255,255,0.02)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-sm)' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Database size={20} color="var(--success)" />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>CSV Format</span>
                </div>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  onClick={handleExportCsv}
                >
                  <span>Export</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
}
