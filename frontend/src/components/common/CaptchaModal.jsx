import { useState } from 'react';
import { ClawCaptcha } from './playcaptcha/ClawCaptcha';
import './playcaptcha/clawcaptcha.css';

export function CaptchaModal({ onVerified, onClose }) {
  const [verified, setVerified] = useState(false);

  const handleVerify = () => {
    setVerified(true);
    setTimeout(() => onVerified?.(), 800);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
    }}>
      <div 
        className="captcha-modal-content"
        style={{ position: 'relative' }}
      >
        <ClawCaptcha
          onVerify={handleVerify}
          title={verified ? 'Terverifikasi!' : 'Ambil mainan yang diminta'}
          assetBase="/assets/toys/"
        />
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: -14,
            right: -14,
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            border: 'none',
            background: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 700,
            color: '#666',
            zIndex: 100,
          }}
          aria-label="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
