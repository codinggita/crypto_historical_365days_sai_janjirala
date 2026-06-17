import React, { useState, useEffect } from 'react';
import coinService from '../services/coinService';
import { Trophy, Medal, Award, TrendingUp, TrendingDown, Loader2, RefreshCw, Star } from 'lucide-react';

export default function Leaderboards() {
  const [activeTab, setActiveTab] = useState('monthly'); // 'monthly' or 'yearly'
  const [monthlyPerformers, setMonthlyPerformers] = useState([]);
  const [yearlyPerformers, setYearlyPerformers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPerformers() {
      setLoading(true);
      setError('');
      try {
        const monRes = await coinService.getTopMonthlyPerformers();
        if (monRes.success && Array.isArray(monRes.data)) {
          setMonthlyPerformers(monRes.data);
        } else {
          setError('Failed to fetch monthly performance ranking.');
        }

        const yearRes = await coinService.getTopYearlyPerformers();
        if (yearRes.success && Array.isArray(yearRes.data)) {
          setYearlyPerformers(yearRes.data);
        } else {
          setError('Failed to fetch yearly performance ranking.');
        }
      } catch (err) {
        console.error('Error fetching leaderboard performance:', err);
        setError('Connection error with analytical leaderboard services.');
      } finally {
        setLoading(false);
      }
    }
    fetchPerformers();
  }, []);

  const activePerformers = activeTab === 'monthly' ? monthlyPerformers : yearlyPerformers;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
      {/* Page Header */}
      <div>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Trophy className="pulsing-glow" size={28} color="var(--primary)" />
          <span>Performance Leaderboards</span>
        </h1>
        <p className="page-subtitle">Identify highest cumulative returns, rank changes, and top-performing assets over monthly and yearly horizons.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)', alignSelf: 'flex-start' }}>
        <button
          onClick={() => setActiveTab('monthly')}
          style={{
            background: activeTab === 'monthly' ? 'var(--primary)' : 'none',
            border: 'none',
            color: activeTab === 'monthly' ? '#fff' : 'var(--text-secondary)',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          Monthly Performance
        </button>
        <button
          onClick={() => setActiveTab('yearly')}
          style={{
            background: activeTab === 'yearly' ? 'var(--primary)' : 'none',
            border: 'none',
            color: activeTab === 'yearly' ? '#fff' : 'var(--text-secondary)',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          Yearly Performance
        </button>
      </div>

      {error && (
        <div className="glass-panel" style={{ padding: '16px', borderColor: 'rgba(244, 63, 94, 0.3)', background: 'var(--danger-glow)', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingDown size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '12px' }}>
          <Loader2 className="pulsing-glow spinning" size={36} color="var(--primary)" />
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Computing leaderboards indices...</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Top 3 Podium Highlights */}
          {activePerformers.length >= 3 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', margin: '12px 0 12px 0' }}>
              
              {/* Silver Podium (Rank 2) */}
              <div className="glass-panel" style={{ padding: '24px', order: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', border: '1px solid rgba(192, 192, 192, 0.3)', background: 'linear-gradient(180deg, rgba(192, 192, 192, 0.05) 0%, rgba(255,255,255,0) 100%)', textAlign: 'center' }}>
                <div style={{ background: 'rgba(192, 192, 192, 0.1)', color: '#c0c0c0', padding: '10px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Medal size={24} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#c0c0c0' }}>2nd Place (Silver)</span>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>{activePerformers[1].coin_name}</h3>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{activePerformers[1].symbol}</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: activePerformers[1].cumulative_return >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {activePerformers[1].cumulative_return >= 0 ? '+' : ''}{activePerformers[1].cumulative_return.toFixed(2)}%
                </span>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Price: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(activePerformers[1].price)}</div>
              </div>

              {/* Gold Podium (Rank 1) */}
              <div className="glass-panel" style={{ padding: '32px 24px', order: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', border: '1px solid rgba(255, 215, 0, 0.4)', background: 'linear-gradient(180deg, rgba(255, 215, 0, 0.05) 0%, rgba(255,255,255,0) 100%)', textAlign: 'center' }}>
                <div style={{ background: 'rgba(255, 215, 0, 0.15)', color: '#ffd700', padding: '12px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Trophy size={28} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#ffd700' }}>1st Place (Gold)</span>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: 0 }}>{activePerformers[0].coin_name}</h3>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{activePerformers[0].symbol}</span>
                <span style={{ fontSize: '24px', fontWeight: 900, color: activePerformers[0].cumulative_return >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {activePerformers[0].cumulative_return >= 0 ? '+' : ''}{activePerformers[0].cumulative_return.toFixed(2)}%
                </span>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Price: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(activePerformers[0].price)}</div>
              </div>

              {/* Bronze Podium (Rank 3) */}
              <div className="glass-panel" style={{ padding: '24px', order: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', border: '1px solid rgba(205, 127, 50, 0.3)', background: 'linear-gradient(180deg, rgba(205, 127, 50, 0.05) 0%, rgba(255,255,255,0) 100%)', textAlign: 'center' }}>
                <div style={{ background: 'rgba(205, 127, 50, 0.1)', color: '#cd7f32', padding: '10px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Award size={24} />
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#cd7f32' }}>3rd Place (Bronze)</span>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', margin: 0 }}>{activePerformers[2].coin_name}</h3>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{activePerformers[2].symbol}</span>
                <span style={{ fontSize: '20px', fontWeight: 800, color: activePerformers[2].cumulative_return >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {activePerformers[2].cumulative_return >= 0 ? '+' : ''}{activePerformers[2].cumulative_return.toFixed(2)}%
                </span>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Price: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(activePerformers[2].price)}</div>
              </div>

            </div>
          )}

          {/* Complete Directory Ranking */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: 0 }}>Leaderboard Listing</h3>
            
            {activePerformers.length === 0 ? (
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No performers data available.
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                      <th style={{ padding: '12px 10px', width: '80px' }}>Rank</th>
                      <th style={{ padding: '12px 10px' }}>Coin Name</th>
                      <th style={{ padding: '12px 10px', textAlign: 'right' }}>Current Price</th>
                      <th style={{ padding: '12px 10px', textAlign: 'right' }}>Cumulative Return</th>
                      <th style={{ padding: '12px 10px', textAlign: 'right' }}>Daily Return</th>
                      <th style={{ padding: '12px 10px', textAlign: 'right' }}>Volatility (7d)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activePerformers.map((coin, index) => {
                      const rank = index + 1;
                      return (
                        <tr key={coin.coin_id} style={{ borderBottom: '1px solid var(--border-color)', color: '#fff' }}>
                          <td style={{ padding: '14px 10px' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                fontSize: '11px',
                                fontWeight: 700,
                                background: rank === 1 ? 'rgba(255, 215, 0, 0.15)' : rank === 2 ? 'rgba(192, 192, 192, 0.15)' : rank === 3 ? 'rgba(205, 127, 50, 0.15)' : 'rgba(255,255,255,0.02)',
                                color: rank === 1 ? '#ffd700' : rank === 2 ? '#c0c0c0' : rank === 3 ? '#cd7f32' : 'var(--text-secondary)',
                                border: rank <= 3 ? '1px solid currentColor' : '1px solid var(--border-color)'
                              }}
                            >
                              {rank}
                            </span>
                          </td>
                          <td style={{ padding: '14px 10px' }}>
                            <div style={{ fontWeight: 600 }}>{coin.coin_name}</div>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{coin.symbol}</span>
                          </td>
                          <td style={{ padding: '14px 10px', textAlign: 'right', fontWeight: 600 }}>
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(coin.price)}
                          </td>
                          <td style={{ padding: '14px 10px', textAlign: 'right', fontWeight: 700, color: coin.cumulative_return >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                            {coin.cumulative_return >= 0 ? '+' : ''}{coin.cumulative_return.toFixed(2)}%
                          </td>
                          <td style={{ padding: '14px 10px', textAlign: 'right', color: coin.daily_return >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                            {coin.daily_return >= 0 ? '+' : ''}{coin.daily_return.toFixed(2)}%
                          </td>
                          <td style={{ padding: '14px 10px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                            {coin.volatility_7d ? `${coin.volatility_7d.toFixed(2)}%` : 'N/A'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
