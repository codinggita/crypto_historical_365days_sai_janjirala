import React, { useState, useEffect } from 'react';
import { Sliders, Volume2, VolumeX, Eye, RefreshCw, Coins, Shield, RotateCcw, CheckCircle, Save } from 'lucide-react';

export default function Settings() {
  // Config states
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [layoutDensity, setLayoutDensity] = useState('comfortable');
  const [pollingInterval, setPollingInterval] = useState('30');
  const [themeAccent, setThemeAccent] = useState('space_blue');
  const [soundNotifications, setSoundNotifications] = useState(false);
  
  // UI states
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('cryptosphere_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.defaultCurrency) setDefaultCurrency(parsed.defaultCurrency);
        if (parsed.layoutDensity) setLayoutDensity(parsed.layoutDensity);
        if (parsed.pollingInterval) setPollingInterval(parsed.pollingInterval);
        if (parsed.themeAccent) setThemeAccent(parsed.themeAccent);
        if (parsed.soundNotifications !== undefined) setSoundNotifications(parsed.soundNotifications);
      } catch (e) {
        console.error('Failed to parse settings from localStorage:', e);
      }
    }
  }, []);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSuccessMsg('');
    const payload = {
      defaultCurrency,
      layoutDensity,
      pollingInterval,
      themeAccent,
      soundNotifications,
    };
    localStorage.setItem('cryptosphere_settings', JSON.stringify(payload));
    setSuccessMsg('Application preferences successfully saved to storage.');
    
    // Trigger window event so other layout panels can react if needed
    window.dispatchEvent(new Event('settingsUpdated'));

    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

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

  const handleToggleSound = () => {
    const nextState = !soundNotifications;
    setSoundNotifications(nextState);
    if (nextState) {
      playAudioAlert(523.25, 'sine', 0.1); // C5
      setTimeout(() => {
        playAudioAlert(659.25, 'sine', 0.12); // E5
      }, 100);
    }
  };

  const handleResetSettings = () => {
    if (!window.confirm('Are you sure you want to reset all preferences to application defaults?')) return;
    localStorage.removeItem('cryptosphere_settings');
    setDefaultCurrency('USD');
    setLayoutDensity('comfortable');
    setPollingInterval('30');
    setThemeAccent('space_blue');
    setSoundNotifications(false);
    setSuccessMsg('Preferences successfully reset to defaults.');
    
    window.dispatchEvent(new Event('settingsUpdated'));
    
    setTimeout(() => {
      setSuccessMsg('');
    }, 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
      {/* Page Header */}
      <div>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sliders size={28} color="var(--primary)" />
          <span>User Preferences & Settings</span>
        </h1>
        <p className="page-subtitle">Configure application layouts, pricing currency selectors, socket polling frequencies, and notification sounds.</p>
      </div>

      {successMsg && (
        <div className="glass-panel" style={{ padding: '16px', borderColor: 'rgba(16, 185, 129, 0.3)', background: 'var(--success-glow)', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left: General & Display Options */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Eye size={18} color="var(--primary-hover)" />
            <span>Display & Layout Options</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Default currency selector */}
            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', marginBottom: '6px' }}>
                <Coins size={12} color="var(--text-secondary)" />
                <span>Base Currency Unit</span>
              </label>
              <select
                className="form-input"
                style={{ width: '100%', background: 'var(--bg-dark)' }}
                value={defaultCurrency}
                onChange={(e) => setDefaultCurrency(e.target.value)}
              >
                <option value="USD">USD ($) - United States Dollar</option>
                <option value="EUR">EUR (€) - Eurozone Euro</option>
                <option value="GBP">GBP (£) - British Pound Sterling</option>
                <option value="BTC">BTC (₿) - Bitcoin Standard</option>
              </select>
            </div>

            {/* Layout Density */}
            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', marginBottom: '6px' }}>
                <Sliders size={12} color="var(--text-secondary)" />
                <span>Interface Density</span>
              </label>
              <select
                className="form-input"
                style={{ width: '100%', background: 'var(--bg-dark)' }}
                value={layoutDensity}
                onChange={(e) => setLayoutDensity(e.target.value)}
              >
                <option value="compact">Compact (Tighter Tables and Card Padding)</option>
                <option value="comfortable">Comfortable (Standard Layout Spacing)</option>
              </select>
            </div>

            {/* Layout theme accent color tint */}
            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', marginBottom: '6px' }}>
                <Sliders size={12} color="var(--text-secondary)" />
                <span>Theme Tint Accent</span>
              </label>
              <select
                className="form-input"
                style={{ width: '100%', background: 'var(--bg-dark)' }}
                value={themeAccent}
                onChange={(e) => setThemeAccent(e.target.value)}
              >
                <option value="space_blue">Space Blue (Default Deep Cyber Tint)</option>
                <option value="emerald_glow">Emerald Green (Neon Green Accent Glow)</option>
                <option value="cyber_coral">Cyber Coral (Neon Pink/Red Tint)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right: Network & Notification Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={18} color="var(--primary-hover)" />
              <span>Real-Time Polling Systems</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Polling Interval */}
              <div>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', marginBottom: '6px' }}>
                  <RefreshCw size={12} color="var(--text-secondary)" />
                  <span>Price Feed Auto-Update Rate</span>
                </label>
                <select
                  className="form-input"
                  style={{ width: '100%', background: 'var(--bg-dark)' }}
                  value={pollingInterval}
                  onChange={(e) => setPollingInterval(e.target.value)}
                >
                  <option value="5">Rapid Polling (Every 5 seconds)</option>
                  <option value="15">Balanced Polling (Every 15 seconds)</option>
                  <option value="30">Standard Polling (Every 30 seconds)</option>
                  <option value="60">Eco Polling (Every 60 seconds)</option>
                </select>
              </div>

              {/* Sound Alerts */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>Audio Alarm Notifications</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Play synth alert tones when high severity drop logs trigger.</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {soundNotifications && (
                    <button
                      type="button"
                      onClick={() => {
                        playAudioAlert(880, 'sine', 0.15);
                      }}
                      className="btn btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '10px', height: '28px' }}
                    >
                      Test Beep
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleToggleSound}
                    style={{
                      background: soundNotifications ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-color)',
                      color: soundNotifications ? '#fff' : 'var(--text-secondary)',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600
                    }}
                  >
                    {soundNotifications ? 'Enabled' : 'Muted'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1, height: '40px' }}>
              <Save size={16} />
              <span>Save Configuration</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1, height: '40px', color: 'var(--text-secondary)' }}
              onClick={handleResetSettings}
            >
              <RotateCcw size={16} />
              <span>Reset Defaults</span>
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}
