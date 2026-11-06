import React, { useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// 1. Logback Appender Node
function LogbackNode({ data }: { data: any }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid #2563eb',
      borderRadius: '12px',
      padding: '12px 16px',
      boxShadow: '0 4px 14px rgba(37, 99, 235, 0.08)',
      minWidth: '220px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <div style={{ background: '#eff6ff', borderRadius: '6px', padding: '4px' }}>
          {/* File/Log Icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#2563eb', letterSpacing: '0.05em' }}>LOG-01 • LOGBACK</div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>AsyncAppender Ring</div>
        </div>
      </div>
      <div style={{ fontSize: '11px', color: '#64748b' }}>8,192 buffer • 5GB disk cap • 14d auto-evict</div>
    </div>
  );
}

// 2. Hash Chain & Virtual Threads Lock Node
function LockNode({ data }: { data: any }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid #16a34a',
      borderRadius: '12px',
      padding: '12px 16px',
      boxShadow: '0 4px 14px rgba(22, 163, 74, 0.08)',
      minWidth: '230px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <div style={{ background: '#f0fdf4', borderRadius: '6px', padding: '4px' }}>
          {/* Lock Icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#16a34a', letterSpacing: '0.05em' }}>LOG-02 • CONCURRENCY</div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>ReentrantLock Hash Chain</div>
        </div>
      </div>
      <div style={{ fontSize: '11px', color: '#64748b' }}>Zero race conditions under Virtual Threads</div>
    </div>
  );
}

// 3. HikariCP Rate Limiter Node
function HikariNode({ data }: { data: any }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid #d97706',
      borderRadius: '12px',
      padding: '12px 16px',
      boxShadow: '0 4px 14px rgba(217, 119, 6, 0.08)',
      minWidth: '230px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <div style={{ background: '#fffbeb', borderRadius: '6px', padding: '4px' }}>
          {/* Shield / Protection */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#d97706', letterSpacing: '0.05em' }}>LOG-03 • POOL PROTECTION</div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>HikariCP 8-Conn Shield</div>
        </div>
      </div>
      <div style={{ fontSize: '11px', color: '#64748b' }}>5 req/min cap on 401 unauthenticated floods</div>
    </div>
  );
}

// 4. PostgreSQL BRIN Index Node
function BrinNode({ data }: { data: any }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid #0284c7',
      borderRadius: '12px',
      padding: '12px 16px',
      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.08)',
      minWidth: '230px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        {/* Official Postgres Elephant Icon */}
        <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
          <path d="M50 10 C30 10 18 24 18 45 C18 64 28 85 46 90 C48 78 46 64 43 54 C39 40 48 30 57 32 C65 34 68 46 65 60 C62 72 58 84 54 90 C72 85 82 64 82 45 C82 24 70 10 50 10 Z" fill="#336791" />
          <circle cx="36" cy="35" r="4" fill="#ffffff" />
        </svg>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#0284c7', letterSpacing: '0.05em' }}>LOG-04 • DB OPTIMIZATION</div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>BRIN Index (18MB)</div>
        </div>
      </div>
      <div style={{ fontSize: '11px', color: '#64748b' }}>Dropped 12GB GIN • 11.6x faster writes</div>
    </div>
  );
}

// 5. Cloudflare R2 Archival Node
function CloudflareNode({ data }: { data: any }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid #ea580c',
      borderRadius: '12px',
      padding: '12px 16px',
      boxShadow: '0 4px 14px rgba(234, 88, 12, 0.08)',
      minWidth: '220px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        {/* Cloudflare Cloud Icon */}
        <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
          <path d="M72 45 C70 30 55 25 45 32 C40 28 30 30 28 38 C18 40 15 50 20 60 C24 68 85 68 85 58 C85 50 80 46 72 45 Z" fill="#F38020" />
        </svg>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#ea580c', letterSpacing: '0.05em' }}>LOG-05 • COLD STORAGE</div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Cloudflare R2 WORM</div>
        </div>
      </div>
      <div style={{ fontSize: '11px', color: '#64748b' }}>.jsonl.gz + SHA-256 Manifest (7-Yr Lock)</div>
    </div>
  );
}

const initialTimelineNodes = [
  {
    id: 'log1',
    type: 'logbackNode',
    position: { x: 30, y: 30 },
    data: { label: 'LOG-01' },
  },
  {
    id: 'log2',
    type: 'lockNode',
    position: { x: 320, y: 30 },
    data: { label: 'LOG-02' },
  },
  {
    id: 'log3',
    type: 'hikariNode',
    position: { x: 620, y: 30 },
    data: { label: 'LOG-03' },
  },
  {
    id: 'log4',
    type: 'brinNode',
    position: { x: 170, y: 190 },
    data: { label: 'LOG-04' },
  },
  {
    id: 'log5',
    type: 'cloudflareNode',
    position: { x: 480, y: 190 },
    data: { label: 'LOG-05' },
  },
];

const initialTimelineEdges = [
  {
    id: 'e-log1-log2',
    source: 'log1',
    target: 'log2',
    animated: true,
    style: { stroke: '#2563eb', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#2563eb' },
  },
  {
    id: 'e-log2-log3',
    source: 'log2',
    target: 'log3',
    animated: true,
    style: { stroke: '#16a34a', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#16a34a' },
  },
  {
    id: 'e-log2-log4',
    source: 'log2',
    target: 'log4',
    animated: true,
    style: { stroke: '#0284c7', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#0284c7' },
  },
  {
    id: 'e-log4-log5',
    source: 'log4',
    target: 'log5',
    animated: true,
    style: { stroke: '#ea580c', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#ea580c' },
  },
];

export default function TimelineInteractiveFlow(): React.JSX.Element {
  const [nodes, , onNodesChange] = useNodesState(initialTimelineNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialTimelineEdges);

  const nodeTypes = useMemo(
    () => ({
      logbackNode: LogbackNode,
      lockNode: LockNode,
      hikariNode: HikariNode,
      brinNode: BrinNode,
      cloudflareNode: CloudflareNode,
    }),
    []
  );

  return (
    <div style={{
      width: '100%',
      height: '340px',
      background: '#f8fbff',
      borderRadius: '16px',
      border: '1px solid #e2eaf8',
      margin: '20px 0 30px',
      overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)'
    }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1.2} color="#c7ddfc" />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
