import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = '#15803d', bg = '#dcfce7' }) => {
  return (
    <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}>
      {Icon && (
        <div style={{
          width: 52,
          height: 52,
          borderRadius: 12,
          backgroundColor: bg,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Icon size={26} />
        </div>
      )}
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </div>
        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: '2px 0' }}>
          {value}
        </div>
        {subtitle && (
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
