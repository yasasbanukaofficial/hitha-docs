import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { LOGOS } from './logos';
import { FlowNodeData } from './types';

export function LogoNode({ data, selected }: { data: FlowNodeData; selected?: boolean }) {
  const logoSrc = data.logo && LOGOS[data.logo] ? LOGOS[data.logo] : data.logo;
  const accent = data.accentColor || '#2160fd';

  return (
    <div
      className={`flow-logo-node-wrapper ${selected ? 'is-selected' : ''}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      tabIndex={0}
      aria-label={`${data.label} node`}
    >
      <Handle type="target" position={Position.Left} style={{ background: accent, width: 8, height: 8 }} />
      <Handle type="target" position={Position.Top} id="top" style={{ background: accent, width: 8, height: 8 }} />

      {/* 3D Glossy Logo Tile (88-100px) */}
      <div
        className="flow-logo-tile"
        style={{
          width: 88,
          height: 88,
          borderRadius: 20,
          background: 'linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%)',
          border: `1.5px solid ${selected ? accent : '#e2e8f0'}`,
          boxShadow: selected
            ? `0 12px 28px -4px ${accent}40, 0 0 0 2px ${accent}`
            : '0 8px 20px -3px rgba(15, 23, 42, 0.08), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          padding: 14,
        }}
      >
        {data.badge && (
          <span
            style={{
              position: 'absolute',
              top: -6,
              right: -6,
              background: data.badgeColor || accent,
              color: '#ffffff',
              fontSize: 10,
              fontWeight: 800,
              padding: '2px 7px',
              borderRadius: 999,
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              fontFamily: 'monospace',
            }}
          >
            {data.badge}
          </span>
        )}

        {logoSrc ? (
          <img
            src={logoSrc}
            alt={data.label}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            loading="lazy"
          />
        ) : (
          <div style={{ fontWeight: 800, fontSize: 13, color: accent }}>{data.label.slice(0, 3)}</div>
        )}
      </div>

      {/* Label and Caption directly underneath tile */}
      <div style={{ marginTop: 8, maxWidth: 140 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', lineHeight: 1.25 }}>
          {data.label}
        </div>
        {data.caption && (
          <div style={{ fontSize: 10.5, color: '#64748b', marginTop: 3, lineHeight: 1.3 }}>
            {data.caption}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Right} style={{ background: accent, width: 8, height: 8 }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ background: accent, width: 8, height: 8 }} />
    </div>
  );
}

export function InfoNode({ data }: { data: FlowNodeData }) {
  const accent = data.accentColor || '#0284c7';

  return (
    <div
      style={{
        background: '#ffffff',
        border: `1.5px solid ${accent}`,
        borderRadius: 12,
        padding: '10px 14px',
        boxShadow: `0 4px 14px ${accent}18`,
        minWidth: 160,
        textAlign: 'center',
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: accent }} />
      <Handle type="target" position={Position.Top} id="top" style={{ background: accent }} />
      <div style={{ fontSize: 10, fontWeight: 800, color: accent, textTransform: 'uppercase' }}>
        {data.infoTitle || data.label}
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>
        {data.infoValue || data.caption}
      </div>
      <Handle type="source" position={Position.Right} style={{ background: accent }} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{ background: accent }} />
    </div>
  );
}

export function DecisionNode({ data }: { data: FlowNodeData }) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '1.5px solid #d97706',
        borderRadius: 20,
        padding: '8px 16px',
        boxShadow: '0 4px 14px rgba(217, 119, 6, 0.12)',
        textAlign: 'center',
        minWidth: 140,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: '#d97706' }} />
      <div style={{ fontSize: 10, fontWeight: 800, color: '#d97706' }}>DECISION</div>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: '#0f172a' }}>{data.question || data.label}</div>
      <Handle type="source" position={Position.Right} id="yes" style={{ background: '#16a34a' }} />
      <Handle type="source" position={Position.Bottom} id="no" style={{ background: '#dc2626' }} />
    </div>
  );
}

export function GroupNode({ data }: { data: FlowNodeData }) {
  const color = data.planeColor || '#2563eb';

  return (
    <div
      style={{
        background: `${color}08`,
        border: `1.5px dashed ${color}60`,
        borderRadius: 16,
        padding: '14px 18px',
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -11,
          left: 16,
          background: '#ffffff',
          border: `1px solid ${color}40`,
          borderRadius: 6,
          padding: '2px 8px',
          fontSize: 10.5,
          fontWeight: 800,
          color: color,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {data.groupTitle || data.label}
      </div>
    </div>
  );
}
