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

// Custom Node for Redis with official logo
function RedisNode({ data }: { data: any }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid #dc2626',
      borderRadius: '12px',
      padding: '12px 16px',
      boxShadow: '0 4px 14px rgba(220, 38, 38, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      minWidth: '200px'
    }}>
      {/* Official Redis Geometric Cube Logo in SVG */}
      <svg width="34" height="34" viewBox="0 0 100 100" fill="none">
        <path d="M50 5 L90 27 L50 49 L10 27 Z" fill="#D82C20" />
        <path d="M10 27 L50 49 L50 95 L10 73 Z" fill="#A32119" />
        <path d="M90 27 L50 49 L50 95 L90 73 Z" fill="#7A1813" />
        <ellipse cx="50" cy="27" rx="18" ry="8" fill="#F87171" opacity="0.6" />
      </svg>
      <div>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#dc2626', letterSpacing: '0.05em' }}>IN-MEMORY CACHE</div>
        <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>Redis 7.2 Cluster</div>
        <div style={{ fontSize: '10.5px', color: '#64748b' }}>Doctor Pools &amp; Bucket4j</div>
      </div>
    </div>
  );
}

// Custom Node for PostgreSQL with official elephant logo
function PostgresNode({ data }: { data: any }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid #0284c7',
      borderRadius: '12px',
      padding: '12px 16px',
      boxShadow: '0 4px 14px rgba(2, 132, 199, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      minWidth: '210px'
    }}>
      {/* Official PostgreSQL Slonik Logo in SVG */}
      <svg width="34" height="34" viewBox="0 0 100 100" fill="none">
        <path d="M50 10 C30 10 18 24 18 45 C18 64 28 85 46 90 C48 78 46 64 43 54 C39 40 48 30 57 32 C65 34 68 46 65 60 C62 72 58 84 54 90 C72 85 82 64 82 45 C82 24 70 10 50 10 Z" fill="#336791" />
        <circle cx="36" cy="35" r="4" fill="#ffffff" />
        <circle cx="37" cy="35" r="2" fill="#1e293b" />
      </svg>
      <div>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7', letterSpacing: '0.05em' }}>PRIMARY DATABASE</div>
        <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>PostgreSQL 16</div>
        <div style={{ fontSize: '10.5px', color: '#64748b' }}>BRIN Indexes &amp; Row Locks</div>
      </div>
    </div>
  );
}

// Custom Node for Spring Boot backend
function SpringBootNode({ data }: { data: any }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid #16a34a',
      borderRadius: '12px',
      padding: '12px 16px',
      boxShadow: '0 4px 14px rgba(22, 163, 74, 0.12)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      minWidth: '220px'
    }}>
      {/* Spring Leaf Logo in SVG */}
      <svg width="34" height="34" viewBox="0 0 100 100" fill="none">
        <path d="M50 10 C75 10 90 35 90 60 C90 85 65 90 50 90 C25 90 10 75 10 50 C10 25 35 10 50 10 Z" fill="#6DB33F" />
        <path d="M30 65 C45 70 70 60 75 35 C60 40 35 50 30 65 Z" fill="#ffffff" />
      </svg>
      <div>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#16a34a', letterSpacing: '0.05em' }}>CORE ENGINE</div>
        <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>Spring Boot 3.3</div>
        <div style={{ fontSize: '10.5px', color: '#64748b' }}>Java 21 Virtual Threads</div>
      </div>
    </div>
  );
}

// Custom Node for LiveKit SFU
function LiveKitNode({ data }: { data: any }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid #2160fd',
      borderRadius: '12px',
      padding: '12px 16px',
      boxShadow: '0 4px 14px rgba(33, 96, 253, 0.12)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      minWidth: '210px'
    }}>
      {/* LiveKit Video Mark */}
      <svg width="34" height="34" viewBox="0 0 100 100" fill="none">
        <rect width="100" height="100" rx="20" fill="#2160fd" />
        <path d="M30 35 L70 50 L30 65 Z" fill="#ffffff" />
      </svg>
      <div>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#2160fd', letterSpacing: '0.05em' }}>SFU MEDIA CLUSTER</div>
        <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>LiveKit WebRTC</div>
        <div style={{ fontSize: '10.5px', color: '#64748b' }}>Sub-200ms E2E Encrypted</div>
      </div>
    </div>
  );
}

// Custom Node for Cloudflare R2
function CloudflareR2Node({ data }: { data: any }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid #f97316',
      borderRadius: '12px',
      padding: '12px 16px',
      boxShadow: '0 4px 14px rgba(249, 115, 22, 0.12)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      minWidth: '210px'
    }}>
      {/* Cloudflare Cloud Logo */}
      <svg width="34" height="34" viewBox="0 0 100 100" fill="none">
        <path d="M72 45 C70 30 55 25 45 32 C40 28 30 30 28 38 C18 40 15 50 20 60 C24 68 85 68 85 58 C85 50 80 46 72 45 Z" fill="#F38020" />
      </svg>
      <div>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#f97316', letterSpacing: '0.05em' }}>COLD STORAGE</div>
        <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0f172a' }}>Cloudflare R2</div>
        <div style={{ fontSize: '10.5px', color: '#64748b' }}>7-Year WORM Object Lock</div>
      </div>
    </div>
  );
}

const initialNodes = [
  {
    id: 'spring',
    type: 'springNode',
    position: { x: 340, y: 150 },
    data: { label: 'Spring Boot' },
  },
  {
    id: 'redis',
    type: 'redisNode',
    position: { x: 50, y: 40 },
    data: { label: 'Redis' },
  },
  {
    id: 'postgres',
    type: 'postgresNode',
    position: { x: 50, y: 260 },
    data: { label: 'PostgreSQL' },
  },
  {
    id: 'livekit',
    type: 'livekitNode',
    position: { x: 670, y: 40 },
    data: { label: 'LiveKit' },
  },
  {
    id: 'r2',
    type: 'r2Node',
    position: { x: 670, y: 260 },
    data: { label: 'Cloudflare R2' },
  },
];

const initialEdges = [
  {
    id: 'e-spring-redis',
    source: 'spring',
    target: 'redis',
    animated: true,
    style: { stroke: '#dc2626', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#dc2626' },
  },
  {
    id: 'e-spring-postgres',
    source: 'spring',
    target: 'postgres',
    animated: true,
    style: { stroke: '#0284c7', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#0284c7' },
  },
  {
    id: 'e-spring-livekit',
    source: 'spring',
    target: 'livekit',
    animated: true,
    style: { stroke: '#2160fd', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#2160fd' },
  },
  {
    id: 'e-spring-r2',
    source: 'spring',
    target: 'r2',
    animated: true,
    style: { stroke: '#f97316', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#f97316' },
  },
];

export default function InteractiveTopologyFlow(): React.JSX.Element {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = useMemo(
    () => ({
      redisNode: RedisNode,
      postgresNode: PostgresNode,
      springNode: SpringBootNode,
      livekitNode: LiveKitNode,
      r2Node: CloudflareR2Node,
    }),
    []
  );

  return (
    <div style={{ 
      width: '100%', 
      height: '420px', 
      background: '#f8fbff', 
      borderRadius: '16px', 
      border: '1px solid #e2eaf8',
      overflow: 'hidden',
      boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.04)'
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
        <MiniMap 
          nodeColor={(n) => {
            if (n.type === 'redisNode') return '#dc2626';
            if (n.type === 'postgresNode') return '#0284c7';
            if (n.type === 'springNode') return '#16a34a';
            if (n.type === 'livekitNode') return '#2160fd';
            return '#f97316';
          }} 
        />
      </ReactFlow>
    </div>
  );
}
