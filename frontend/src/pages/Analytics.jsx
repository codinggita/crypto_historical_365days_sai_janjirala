import React, { useEffect, useState } from 'react';
import analyticsService from '../services/analyticsService';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame, ShieldAlert, BarChart3, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Analytics() {
  const [priceSummary, setPriceSummary] = useState(null);
  const [volumeSpikes, setVolumeSpikes] = useState([]);
  const [highVolatility, setHighVolatility] = useState([]);
  const [topReturns, setTopReturns] = useState([]);
  const [negativeReturns, setNegativeReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      setError('');
      try {
        const [summaryRes, spikesRes, volRes, returnsRes, negReturnsRes] = await Promise.all([
          analyticsService.getPriceSummary(),
          analyticsService.getVolumeSpike(),
          analyticsService.getHighVolatility(),
          analyticsService.getTopReturns(),
          analyticsService.getNegativeReturns()
        ]);

        if (summaryRes.success) setPriceSummary(summaryRes);
        if (spikesRes.success && Array.isArray(spikesRes.data)) setVolumeSpikes(spikesRes.data.slice(0, 10));
        if (volRes.success && Array.isArray(volRes.data)) setHighVolatility(volRes.data.slice(0, 10));
        if (returnsRes.success && Array.isArray(returnsRes.data)) setTopReturns(returnsRes.data.slice(0, 5));
        if (negReturnsRes.success && Array.isArray(negReturnsRes.data)) setNegativeReturns(negReturnsRes.data.slice(0, 5));
      } catch (err) {
        console.error('Failed to load market analytics:', err);
        setError('Failed to calculate extreme price distribution matrices.');
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
  };

  const formatLargeNum = (num) => {
    if (num === null || num === undefined) return 'N/A';
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '12px' }}>
        <Loader2 className="pulsing-glow" size={40} color="var(--primary)" />
        <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Compiling volatility grids...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
      
      {/* Title */}
      <div>
        <h1 className="page-title">Analytics Hub</h1>
        <p className="page-subtitle">Track historical extremes, volume spikes, and high-volatility events.</p>
      </div>

      {error && (
        <div className="glass-panel" style={{ padding: '16px', borderColor: 'rgba(244, 63, 94, 0.3)', background: 'var(--danger-glow)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {/* Global Extremes Overview */}
      {priceSummary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          
          <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--success)' }}>
            <span className="form-label" style={{ fontSize: '10px' }}>Global Price Peak</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)', marginTop: '6px' }}>
              {formatPrice(priceSummary.highest?.price)}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px' }}>
              Recorded on <strong>{priceSummary.highest?.coin_name} ({priceSummary.highest?.symbol})</strong> on {priceSummary.highest?.date}.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid var(--danger)' }}>
            <span className="form-label" style={{ fontSize: '10px' }}>Global Price Floor</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)', marginTop: '6px' }}>
              {formatPrice(priceSummary.lowest?.price)}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px' }}>
              Recorded on <strong>{priceSummary.lowest?.coin_name} ({priceSummary.lowest?.symbol})</strong> on {priceSummary.lowest?.date}.
            </p>
          </div>

        </div>
      )}

      {/* Volume Spikes vs Volatility split grids */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Volume spikes */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} color="var(--primary-hover)" />
            <span>Volume Spikes (Peak Liquidity)</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {volumeSpikes.map((coin, index) => (
              <Link
                key={coin.coin_id + '-' + index}
                to={`/coins/${coin.coin_id}`}
                className="glass-panel-interactive"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', textDecoration: 'none' }}
              >
                <div>
                  <span style={{ fontWeight: 700, color: '#fff', fontSize: '13px' }}>{coin.symbol}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}>{coin.date}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>{formatLargeNum(coin.volume)}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Price: {formatPrice(coin.price)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Volatility */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '18px', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="var(--warning)" />
            <span>Extreme Volatility Signals</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {highVolatility.map((coin, index) => (
              <Link
                key={coin.coin_id + '-' + index}
                to={`/coins/${coin.coin_id}`}
                className="glass-panel-interactive"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', textDecoration: 'none' }}
              >
                <div>
                  <span style={{ fontWeight: 700, color: '#fff', fontSize: '13px' }}>{coin.symbol}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '6px' }}>{coin.date}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--info)', fontFamily: 'var(--font-mono)' }}>
                    {coin.volatility_7d?.toFixed(2)}%
                  </span>
                  <span style={{ fontSize: '11px', color: (coin.daily_return || 0) >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                    Return: {coin.daily_return?.toFixed(2)}%
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Return anomaliessplit view */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        
        {/* Top gainers */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={16} color="var(--success)" />
            <span>Top Growth Anomalies</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {topReturns.map((coin, index) => (
              <div key={coin.coin_id + '-' + index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>{coin.coin_name} ({coin.symbol})</span>
                <span className="badge badge-up">+{coin.daily_return?.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top dropouts */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Flame size={16} color="var(--danger)" />
            <span>Top Drawdown Events</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {negativeReturns.map((coin, index) => (
              <div key={coin.coin_id + '-' + index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <span style={{ color: '#fff', fontWeight: 600 }}>{coin.coin_name} ({coin.symbol})</span>
                <span className="badge badge-down">{coin.daily_return?.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
