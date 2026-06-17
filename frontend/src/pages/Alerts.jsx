import React, { useState, useEffect } from 'react';
import coinService from '../services/coinService';
import { Bell, BellRing, AlertTriangle, TrendingDown, Activity, Volume2, VolumeX, Filter, Loader2, RefreshCw } from 'lucide-react';

export default function Alerts() {
  const [activeTab, setActiveTab] = useState('volatility'); // 'volatility' or 'drops'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Audio alert settings state
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [minSeverity, setMinSeverity] = useState('all'); // 'all', 'medium', 'high'

  const playAudioAlert = (frequency = 440, type = 'sine', duration = 0.15) => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime); // Low volume
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Web Audio API is blocked or not supported:', e);
    }
  };

  const toggleAudio = () => {
    const nextState = !audioEnabled;
    setAudioEnabled(nextState);
    if (nextState) {
      // Play a short double beep confirming audio is enabled
      playAudioAlert(523.25, 'sine', 0.1); // C5
      setTimeout(() => {
        playAudioAlert(659.25, 'sine', 0.12); // E5
      }, 100);
    }
  };

  // Alerts data state
  const [volatilityAlerts, setVolatilityAlerts] = useState([]);
  const [marketDropAlerts, setMarketDropAlerts] = useState([]);

  useEffect(() => {
    async function loadAlerts() {
      setLoading(true);
      setError('');
      try {
        const volRes = await coinService.getHighVolatilityAlerts();
        if (volRes.success && Array.isArray(volRes.data)) {
          setVolatilityAlerts(volRes.data);
        } else {
          setError('Failed to fetch volatility alert feed.');
        }

        const dropRes = await coinService.getMarketDropAlerts();
        if (dropRes.success && Array.isArray(dropRes.data)) {
          setMarketDropAlerts(dropRes.data);
        } else {
          setError('Failed to fetch market drop warnings.');
        }
      } catch (err) {
        console.error(err);
        setError('Error establishing connection with risk monitoring nodes.');
      } finally {
        setLoading(false);
      }
    }
    loadAlerts();
  }, []);

  const getVolatilitySeverity = (val) => {
    return val >= 20 ? 'high' : 'medium';
  };

  const getDropSeverity = (val) => {
    return val <= -10 ? 'high' : 'medium';
  };

  const filteredVolatilityAlerts = volatilityAlerts.filter(item => {
    if (minSeverity === 'all') return true;
    const severity = getVolatilitySeverity(item.volatility_7d);
    if (minSeverity === 'medium') return severity === 'medium' || severity === 'high';
    return severity === 'high';
  });

  const filteredMarketDropAlerts = marketDropAlerts.filter(item => {
    if (minSeverity === 'all') return true;
    const severity = getDropSeverity(item.daily_return);
    if (minSeverity === 'medium') return severity === 'medium' || severity === 'high';
    return severity === 'high';
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BellRing className="pulsing-glow" size={28} color="var(--primary)" />
            <span>Market Alerts & Risk Feed</span>
          </h1>
          <p className="page-subtitle">Track high volatility events and sharp price drop risks filtered by on-chain indicators.</p>
        </div>

        {/* Quick Audio & Volume Control panel */}
        <div className="glass-panel" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
          <button
            onClick={toggleAudio}
            style={{
              background: 'none',
              border: 'none',
              color: audioEnabled ? 'var(--primary-hover)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            {audioEnabled ? <Volume2 size={16} color="var(--primary)" /> : <VolumeX size={16} />}
            <span>{audioEnabled ? 'Audio Alerts On' : 'Audio Muted'}</span>
          </button>
          
          {audioEnabled && (
            <button
              onClick={() => {
                // High alert alarm sound check
                playAudioAlert(880, 'triangle', 0.15);
                setTimeout(() => playAudioAlert(880, 'triangle', 0.15), 180);
              }}
              className="btn btn-secondary"
              style={{ padding: '4px 8px', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px', height: '26px' }}
            >
              Test Tone
            </button>
          )}
        </div>
      </div>

      {/* Tabs and Filtering Sub-Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
        {/* Toggle tabs */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveTab('volatility')}
            style={{
              background: activeTab === 'volatility' ? 'var(--primary)' : 'none',
              border: 'none',
              color: activeTab === 'volatility' ? '#fff' : 'var(--text-secondary)',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={14} />
              <span>High Volatility ({`>=10%`})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('drops')}
            style={{
              background: activeTab === 'drops' ? 'var(--primary)' : 'none',
              border: 'none',
              color: activeTab === 'drops' ? '#fff' : 'var(--text-secondary)',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingDown size={14} />
              <span>Market Drops ({`<=-5%`})</span>
            </div>
          </button>
        </div>

        {/* Severity Filter Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={14} color="var(--text-muted)" />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Severity Threshold:</span>
          <select
            className="form-input"
            value={minSeverity}
            onChange={(e) => setMinSeverity(e.target.value)}
            style={{ fontSize: '12px', padding: '4px 10px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)' }}
          >
            <option value="all">All Alerts</option>
            <option value="medium">Medium & High Risk</option>
            <option value="high">High Risk Only</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="glass-panel" style={{ padding: '16px', borderColor: 'rgba(244, 63, 94, 0.3)', background: 'var(--danger-glow)', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '250px', gap: '12px' }}>
          <Loader2 className="pulsing-glow spinning" size={32} color="var(--primary)" />
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Monitoring active alert signals...</span>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {activeTab === 'volatility' ? (
            filteredVolatilityAlerts.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: '60px 0', textAlign: 'center', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                No high volatility alerts match your severity settings.
              </div>
            ) : (
              filteredVolatilityAlerts.map((item) => {
                const severity = getVolatilitySeverity(item.volatility_7d);
                return (
                  <div
                    key={item.coin_id}
                    className="glass-panel"
                    style={{
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      borderColor: severity === 'high' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)',
                      background: severity === 'high' ? 'rgba(244, 63, 94, 0.02)' : 'rgba(245, 158, 11, 0.02)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Activity size={18} color={severity === 'high' ? 'var(--danger)' : 'var(--warning)'} />
                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{item.coin_name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{item.symbol}</span>
                      </div>
                      <span
                        style={{
                          fontSize: '9px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: severity === 'high' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          color: severity === 'high' ? 'var(--danger)' : 'var(--warning)',
                          border: severity === 'high' ? '1px solid rgba(244, 63, 94, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)'
                        }}
                      >
                        {severity.toUpperCase()} RISK
                      </span>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>7-day Volatility index:</span>
                        <strong style={{ color: '#fff' }}>{item.volatility_7d.toFixed(2)}%</strong>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                        <div style={{ width: `${Math.min(100, item.volatility_7d * 2.5)}%`, height: '100%', background: severity === 'high' ? 'linear-gradient(90deg, var(--warning), var(--danger))' : 'var(--warning)' }}></div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      <div>
                        <span>Current Price:</span>
                        <strong style={{ display: 'block', color: '#fff', fontSize: '12px', marginTop: '2px' }}>
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price)}
                        </strong>
                      </div>
                      <div>
                        <span>Daily Return:</span>
                        <strong style={{ display: 'block', color: item.daily_return >= 0 ? 'var(--success)' : 'var(--danger)', fontSize: '12px', marginTop: '2px' }}>
                          {item.daily_return >= 0 ? '+' : ''}{item.daily_return.toFixed(2)}%
                        </strong>
                      </div>
                    </div>
                  </div>
                );
              })
            )
          ) : (
            filteredMarketDropAlerts.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: '60px 0', textAlign: 'center', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                No market drop warnings match your severity settings.
              </div>
            ) : (
              filteredMarketDropAlerts.map((item) => {
                const severity = getDropSeverity(item.daily_return);
                return (
                  <div
                    key={item.coin_id}
                    className="glass-panel"
                    style={{
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      borderColor: severity === 'high' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)',
                      background: severity === 'high' ? 'rgba(244, 63, 94, 0.02)' : 'rgba(245, 158, 11, 0.02)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <TrendingDown size={18} color={severity === 'high' ? 'var(--danger)' : 'var(--warning)'} />
                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>{item.coin_name}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{item.symbol}</span>
                      </div>
                      <span
                        style={{
                          fontSize: '9px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: severity === 'high' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                          color: severity === 'high' ? 'var(--danger)' : 'var(--warning)',
                          border: severity === 'high' ? '1px solid rgba(244, 63, 94, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)'
                        }}
                      >
                        {severity.toUpperCase()} DROP
                      </span>
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Daily return:</span>
                        <strong style={{ color: 'var(--danger)' }}>{item.daily_return.toFixed(2)}%</strong>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '3px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                        <div style={{ width: `${Math.min(100, Math.abs(item.daily_return) * 6)}%`, height: '100%', background: severity === 'high' ? 'linear-gradient(90deg, var(--warning), var(--danger))' : 'var(--warning)' }}></div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                      <div>
                        <span>Current Price:</span>
                        <strong style={{ display: 'block', color: '#fff', fontSize: '12px', marginTop: '2px' }}>
                          {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.price)}
                        </strong>
                      </div>
                      <div>
                        <span>7-Day Volatility:</span>
                        <strong style={{ display: 'block', color: '#fff', fontSize: '12px', marginTop: '2px' }}>
                          {item.volatility_7d.toFixed(2)}%
                        </strong>
                      </div>
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>
      )}
    </div>
  );
}
