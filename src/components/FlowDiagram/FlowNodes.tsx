import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { LOGO_REGISTRY } from './logos';

export function LogoNode({ data, selected }: { data: any; selected?: boolean }) {
  const logo = LOGO_REGISTRY[data.logo] || {
    name: data.title || 'Service',
    src: '/img/logos/hitha.svg',
    color: '#2160fd',
  };

  const badgeColor = data.badgeColor || '#2160fd';

  return (
    <div
      className={`flow-logo-node ${selected ? 'is-selected' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        position: 'relative',
        width: '130px',
      }}
      aria-label={data.title || logo.name}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#64748b', width: 8, height: 8 }} />
      <Handle type="target" position={Position.Top} id="top" style={{ background: '#64748b', width: 8, height: 8 }} />

      {/* 3D Glossy Tile */}
      <div
        className="logo-tile-box"
        style={{
          width: '88px',
          height: '88px',
          borderRadius: '20px',
          background: 'linear-gradient(145deg, #ffffff, #f1f5f9)',
          boxShadow: selected
            ? `0 12px 30px -4px ${logo.color}50, 0 0 0 2.5px ${logo.color}`
            : '0 10px 24px -4px rgba(15, 23, 42, 0.12), inset 0 1px 1px rgba(255, 255, 255, 0.8), inset 0 -2px 4px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(226, 232, 240, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Optional Badge */}
        {data.badge && (
          <span
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: badgeColor,
              color: '#ffffff',
              fontSize: '10.5px',
              fontWeight: 800,
              padding: '2px 7px',
              borderRadius: '9999px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              border: '2px solid #ffffff',
              zIndex: 10,
            }}
          >
            {data.badge}
          </span>
        )}

        <img
          src={logo.src}
          alt={logo.name}
          style={{
            width: '48px',
            height: '48px',
            objectFit: 'contain',
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.08))',
          }}
        />
      </div>

      {/* Title & Caption under the tile */}
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--ifm-heading-color, #0f172a)', lineHeight: 1.25 }}>
          {data.title || logo.name}
        </div>
        {data.caption && (
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px', lineHeight: 1.3 }}>
            {data.caption}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} style={{ background: '#64748b', width: 8, height: 8 }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ background: '#64748b', width: 8, height: 8 }} />
    </div>
  );
}

export function InfoNode({ data, selected }: { data: any; selected?: boolean }) {
  const accent = data.color || '#2563eb';
  return (
    <div
      style={{
        background: '#ffffff',
        border: `1.5px solid ${selected ? accent : '#e2e8f0'}`,
        borderLeft: `4px solid ${accent}`,
        borderRadius: '12px',
        padding: '10px 14px',
        boxShadow: selected ? `0 8px 24px ${accent}25` : '0 4px 14px rgba(15, 23, 42, 0.06)',
        minWidth: '170px',
        maxWidth: '220px',
        cursor: 'pointer',
      }}
      aria-label={data.title}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#64748b' }} />
      <Handle type="target" position={Position.Top} id="top" style={{ background: '#64748b' }} />
      <div style={{ fontSize: '10.5px', fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {data.badge || 'CONFIG'}
      </div>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: '2px 0' }}>
        {data.title}
      </div>
      {data.caption && (
        <div style={{ fontSize: '11px', color: '#64748b' }}>
          {data.caption}
        </div>
      )}
      <Handle type="source" position={Position.Right} style={{ background: '#64748b' }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ background: '#64748b' }} />
    </div>
  );
}

export function DecisionNode({ data, selected }: { data: any; selected?: boolean }) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1.5px solid #d97706',
        borderRadius: '9999px',
        padding: '8px 18px',
        boxShadow: selected ? '0 8px 20px rgba(217, 119, 6, 0.25)' : '0 4px 12px rgba(217, 119, 6, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }}
      aria-label={data.label}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#d97706' }} />
      <div style={{ fontSize: '12px', fontWeight: 700, color: '#92400e' }}>
        {data.label || 'Decision?'}
      </div>
      <Handle type="source" position={Position.Right} id="yes" style={{ background: '#16a34a' }} />
      <Handle type="source" position={Position.Bottom} id="no" style={{ background: '#dc2626' }} />
    </div>
  );
}

export function GroupNode({ data }: { data: any }) {
  const accent = data.color || '#2563eb';
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '16px',
        border: `2px dashed ${accent}60`,
        background: `${accent}06`,
        padding: '14px',
        position: 'relative',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '-12px',
          left: '16px',
          background: accent,
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: 800,
          padding: '2px 10px',
          borderRadius: '9999px',
          letterSpacing: '0.04em',
        }}
      >
        {data.label}
      </div>
    </div>
  );
}
