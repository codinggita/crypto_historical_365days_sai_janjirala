import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '70vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '50px 30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Glow behind icon */}
        <div style={{
          position: 'absolute',
          top: '20px',
          width: '80px',
          height: '80px',
          background: 'rgba(0, 242, 254, 0.15)',
          filter: 'blur(20px)',
          borderRadius: '50%',
          zIndex: 0
        }} />

        <Compass size={64} color="var(--primary)" className="pulsing-glow" style={{ zIndex: 1 }} />
        
        <div style={{ zIndex: 1 }}>
          <h1 style={{
            fontSize: '72px',
            fontWeight: 900,
            fontFamily: 'var(--font-display)',
            background: 'linear-gradient(135deg, #fff 30%, var(--primary-hover) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1,
            marginBottom: '10px',
            letterSpacing: '-2px'
          }}>
            404
          </h1>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '10px'
          }}>
            Drifting in Deep Space
          </h2>
          <p style={{
            fontSize: '14px',
            color: 'var(--text-secondary)',
            lineHeight: 1.6
          }}>
            The sector of the crypto-verse you are looking for does not exist or has drifted offline.
          </p>
        </div>

        <Link 
          to="/" 
          className="btn btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 700,
            padding: '12px 24px',
            borderRadius: 'var(--radius-md)',
            zIndex: 1
          }}
        >
          <ArrowLeft size={16} />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
