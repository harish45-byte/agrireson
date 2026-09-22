import React from 'react';
import { Sprout, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid var(--border)',
      padding: '40px 20px',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            backgroundColor: '#dcfce7',
            color: '#15803d',
            padding: 8,
            borderRadius: 8
          }}>
            <Sprout size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: '#15803d', fontSize: '1.05rem' }}>
              AgriReson Platform
            </div>
            <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Empowering farmers with transparent direct-to-consumer marketplace &amp; real-time profit tracking.
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.875rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
          Direct From Farm to Kitchen <Heart size={14} color="#ef4444" fill="#ef4444" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
