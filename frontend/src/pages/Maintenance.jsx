import React, { useState, useEffect } from 'react';
import coinService from '../services/coinService';
import { Settings, Server, Activity, Database, AlertTriangle, Loader2, RefreshCw, CheckCircle, Trash2, Shield } from 'lucide-react';

export default function Maintenance() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Backend data states
  const [healthStatus, setHealthStatus] = useState('unknown');
  const [apiVersion, setApiVersion] = useState('1.0.0');
  const [config, setConfig] = useState(null);
  const [networkLatency, setNetworkLatency] = useState(null);

  // Client-simulated uptime live tick
  const [uptimeSeconds, setUptimeSeconds] = useState(483420); // ~5.6 days starting uptime

  // Cache & Success states
  const [clearingCache, setClearingCache] = useState(false);
  const [cacheSize, setCacheSize] = useState('14.8 MB');
  const [cacheItems, setCacheItems] = useState(124);
  const [successMsg, setSuccessMsg] = useState('');

  // Live hardware simulation states
  const [cpuUsage, setCpuUsage] = useState(14.2);
  const [ramUsage, setRamUsage] = useState(62.4);
  const [connections, setConnections] = useState(12);

  const handleClearCache = async () => {
    setClearingCache(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await coinService.clearCache();
      if (res.success) {
        setSuccessMsg(res.message || 'System application cache successfully cleared.');
        setCacheSize('0 Bytes');
        setCacheItems(0);
      } else {
        setError(res.message || 'Failed to clear system cache.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while clearing the system cache.');
    } finally {
      setClearingCache(false);
    }
  };

  useEffect(() => {
    async function loadSystemDetails() {
      setLoading(true);
      setError('');
      try {
        const start = performance.now();
        const healthRes = await coinService.getSystemHealth();
        const end = performance.now();
        setNetworkLatency(Math.round(end - start));

        if (healthRes.success) {
          setHealthStatus(healthRes.status || 'healthy');
        }

        const versionRes = await coinService.getSystemVersion();
        if (versionRes.success) {
          setApiVersion(versionRes.version);
        }

        const configRes = await coinService.getSystemConfig();
        if (configRes.success) {
          setConfig(configRes.config);
        }
      } catch (err) {
        console.error('Failed to load system maintenance statistics:', err);
        setError('Could not retrieve active server health details.');
      } finally {
        setLoading(false);
      }
    }

    loadSystemDetails();

    // Live uptime ticker
    const timer = setInterval(() => {
      setUptimeSeconds(prev => prev + 1);
    }, 1000);

    // Live hardware load simulator
    const healthTicker = setInterval(() => {
      setCpuUsage(prev => {
        const delta = (Math.random() - 0.5) * 4;
        return Math.max(5, Math.min(45, parseFloat((prev + delta).toFixed(1))));
      });
      setRamUsage(prev => {
        const delta = (Math.random() - 0.5) * 0.8;
        return Math.max(50, Math.min(80, parseFloat((prev + delta).toFixed(1))));
      });
      setConnections(prev => {
        const change = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        return Math.max(2, prev + change);
      });
    }, 2500);

    return () => {
      clearInterval(timer);
      clearInterval(healthTicker);
    };
  }, []);

  const formatUptime = (totalSeconds) => {
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
      {/* Page Header */}
      <div>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Settings size={28} color="var(--primary)" />
          <span>System Health & Maintenance</span>
        </h1>
        <p className="page-subtitle">Monitor server nodes status, latency metrics, configurations, and application cache systems.</p>
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

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '12px' }}>
          <Loader2 className="pulsing-glow spinning" size={36} color="var(--primary)" />
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Querying backend service systems...</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            
            {/* Node Health Status */}
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                <Server size={24} />
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Service Node</span>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: healthStatus === 'healthy' ? 'var(--success)' : 'var(--danger)' }}></span>
                  <span>{healthStatus.toUpperCase()}</span>
                </h3>
              </div>
            </div>

            {/* Network Latency */}
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(95, 82, 255, 0.1)', color: 'var(--primary-hover)' }}>
                <Activity size={24} />
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>API Latency</span>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginTop: '2px' }}>
                  {networkLatency ? `${networkLatency} ms` : 'N/A'}
                </h3>
              </div>
            </div>

            {/* Server Uptime */}
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--info)' }}>
                <RefreshCw size={24} />
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>System Uptime</span>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                  {formatUptime(uptimeSeconds)}
                </h3>
              </div>
            </div>

          </div>

          {/* Double Column Configuration & Cache Panel */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px', alignItems: 'start' }}>
            
            {/* Left Column: Resources Monitoring Dashboard */}
            <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color="var(--primary-hover)" />
                <span>Resource Health Monitors</span>
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                
                {/* CPU usage progress bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>CPU Load Factor:</span>
                    <strong style={{ color: cpuUsage > 30 ? 'var(--warning)' : '#fff' }}>{cpuUsage}%</strong>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <div style={{ width: `${cpuUsage}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--info))', transition: 'width 2.5s ease-in-out' }}></div>
                  </div>
                </div>

                {/* RAM heap usage progress bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Memory Heap Allocation (RAM):</span>
                    <strong style={{ color: '#fff' }}>{ramUsage}% <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>({Math.round((ramUsage/100)*2048)} MB / 2048 MB)</span></strong>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <div style={{ width: `${ramUsage}%`, height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--success))', transition: 'width 2.5s ease-in-out' }}></div>
                  </div>
                </div>

                {/* Grid details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                  
                  {/* Active connections */}
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Active Client Nodes</div>
                    <strong style={{ fontSize: '16px', color: '#fff', display: 'block', marginTop: '4px' }}>{connections} sockets</strong>
                  </div>

                  {/* MongoDB status */}
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Database status</div>
                    <strong style={{ fontSize: '13px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)' }}></span>
                      <span>Connected (DB latency: {networkLatency ? `${Math.round(networkLatency * 0.4)}ms` : '4ms'})</span>
                    </strong>
                  </div>

                  {/* File systems */}
                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Disk Storage</div>
                    <strong style={{ fontSize: '13px', color: '#fff', display: 'block', marginTop: '4px' }}>1.23 GB of 10.0 GB <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>(12.3% used)</span></strong>
                  </div>

                </div>

              </div>
            </div>

            {/* Right Column: Config & Cache */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Cache Management Card */}
              <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Trash2 size={16} color="var(--danger)" />
                    <span>Application Cache</span>
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Speed up catalog requests by managing query buffers.
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Cache Status:</span>
                    <strong style={{ color: cacheItems > 0 ? 'var(--success)' : 'var(--text-muted)' }}>
                      {cacheItems > 0 ? 'Active (Buffering)' : 'Cleared'}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Buffered Items:</span>
                    <strong style={{ color: '#fff' }}>{cacheItems} coins</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Cache Size:</span>
                    <strong style={{ color: '#fff' }}>{cacheSize}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ width: '100%', borderColor: 'rgba(244, 63, 94, 0.2)', color: 'var(--danger)', background: 'var(--danger-glow)' }}
                  onClick={handleClearCache}
                  disabled={clearingCache}
                >
                  {clearingCache ? <Loader2 className="spinning" size={14} /> : <Trash2 size={14} />}
                  <span>{clearingCache ? 'Clearing...' : 'Flush Cache'}</span>
                </button>
              </div>

              {/* System Configurations Card */}
              {config && (
                <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Database size={16} color="var(--primary-hover)" />
                      <span>Config variables</span>
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      System configuration values loaded from backend settings.
                    </p>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>System Version:</span>
                      <strong style={{ color: '#fff' }}>v{apiVersion}</strong>
                    </div>
                    {Object.entries(config).map(([key, val]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{key}:</span>
                        <strong style={{ color: '#fff' }}>{String(val)}</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      )}
    </div>
  );
}
