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

function InboundNode() {
  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid #64748b',
      borderRadius: '12px',
      padding: '12px 16px',
      minWidth: '190px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
    }}>
      <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748b' }}>CLIENT INGRESS</div>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Public &amp; Doctor APIs</div>
      <div style={{ fontSize: '11px', color: '#64748b' }}>X-Forwarded-For IP</div>
    </div>
  );
}

function RedisBucketNode() {
  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid #dc2626',
      borderRadius: '12px',
      padding: '12px 16px',
      minWidth: '220px',
      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.08)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <svg width="24" height="24" viewBox="0 0 100 100" fill="none">
          <path d="M50 5 L90 27 L50 49 L10 27 Z" fill="#D82C20" />
          <path d="M10 27 L50 49 L50 95 L10 73 Z" fill="#A32119" />
          <path d="M90 27 L50 49 L50 95 L90 73 Z" fill="#7A1813" />
        </svg>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#dc2626' }}>TOKEN BUCKET</div>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Redis + Bucket4j</div>
        </div>
      </div>
      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Atomic token replenishment</div>
    </div>
  );
}

function TierNode({ data }: { data: any }) {
  return (
    <div style={{
      background: '#ffffff',
      border: `1.5px solid ${data.color}`,
      borderRadius: '12px',
      padding: '10px 14px',
      minWidth: '200px',
      boxShadow: `0 4px 12px ${data.color}15`
    }}>
      <div style={{ fontSize: '10px', fontWeight: 800, color: data.color }}>{data.tier}</div>
      <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0f172a' }}>{data.title}</div>
      <div style={{ fontSize: '11px', fontWeight: 600, color: data.color, marginTop: '2px' }}>{data.limit}</div>
    </div>
  );
}

const initialNodes = [
  { id: 'inbound', type: 'inboundNode', position: { x: 30, y: 130 }, data: {} },
  { id: 'redis', type: 'redisNode', position: { x: 280, y: 125 }, data: {} },
  { id: 't1', type: 'tierNode', position: { x: 570, y: 20 }, data: { tier: 'TIER 1 (STRICT)', title: 'Auth & OTP', limit: '5 req / min', color: '#dc2626' } },
  { id: 't2', type: 'tierNode', position: { x: 570, y: 120 }, data: { tier: 'TIER 2 (PUBLIC)', title: 'Doctors & Slots', limit: '60 req / min', color: '#2563eb' } },
  { id: 't3', type: 'tierNode', position: { x: 570, y: 220 }, data: { tier: 'TIER 3 (AUTH)', title: 'Clinical & Webhooks', limit: '300 req / min', color: '#16a34a' } },
];

const initialEdges = [
  { id: 'e1', source: 'inbound', target: 'redis', animated: true, style: { stroke: '#64748b', strokeWidth: 2 } },
  { id: 'e2', source: 'redis', target: 't1', animated: true, style: { stroke: '#dc2626', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#dc2626' } },
  { id: 'e3', source: 'redis', target: 't2', animated: true, style: { stroke: '#2563eb', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#2563eb' } },
  { id: 'e4', source: 'redis', target: 't3', animated: true, style: { stroke: '#16a34a', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#16a34a' } },
];

export default function RateLimitingFlow(): React.JSX.Element {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = useMemo(() => ({
    inboundNode: InboundNode,
    redisNode: RedisBucketNode,
    tierNode: TierNode,
  }), []);

  return (
    <div style={{
      width: '100%',
      height: '330px',
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
      </ReactFlow>
    </div>
  );
}
