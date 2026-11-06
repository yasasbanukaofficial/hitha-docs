import React, { useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// 1. Backend Server Node (Spring Boot + DB)
function BackendNode({ data }: { data: any }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid #0f172a',
      borderRadius: '14px',
      padding: '16px 20px',
      boxShadow: '0 8px 24px -4px rgba(15, 23, 42, 0.08)',
      minWidth: '240px',
      textAlign: 'center'
    }}>
      {/* 3D Stack / Server Icon */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
        <svg width="44" height="44" viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="25" rx="35" ry="14" fill="#0f172a" />
          <path d="M15 25 v24 c0 8 16 14 35 14 s35 -6 35 -14 v-24" fill="#334155" />
          <ellipse cx="50" cy="49" rx="35" ry="14" fill="#1e293b" />
          <path d="M15 49 v24 c0 8 16 14 35 14 s35 -6 35 -14 v-24" fill="#475569" />
          <ellipse cx="50" cy="73" rx="35" ry="14" fill="#334155" />
          <circle cx="28" cy="48" r="3" fill="#22c55e" />
          <circle cx="28" cy="72" r="3" fill="#22c55e" />
        </svg>
      </div>
      <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em' }}>YOUR SERVER CODE</div>
      <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '2px 0 4px' }}>YOUR BACKEND</div>
      <div style={{ fontSize: '11px', color: '#64748b' }}>Spring Boot REST / Express</div>
    </div>
  );
}

// 2. Client App Node (Flutter / React Native)
function ClientAppNode({ data }: { data: any }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid #2563eb',
      borderRadius: '14px',
      padding: '16px',
      boxShadow: '0 8px 24px -4px rgba(37, 99, 235, 0.1)',
      minWidth: '240px',
      textAlign: 'center'
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
        {/* Modern Smartphone Model Icon */}
        <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
          <rect x="25" y="10" width="50" height="80" rx="10" fill="#0f172a" stroke="#2563eb" strokeWidth="3" />
          <rect x="30" y="18" width="40" height="60" rx="4" fill="#eff6ff" />
          <circle cx="50" cy="84" r="3" fill="#ffffff" />
          <rect x="42" y="13" width="16" height="3" rx="1.5" fill="#64748b" />
        </svg>
      </div>
      <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b' }}>PATIENT / DOCTOR DEVICE</div>
      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>YOUR APP</div>

      <div style={{
        background: '#2160fd',
        borderRadius: '8px',
        padding: '10px 14px',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        boxShadow: '0 4px 12px rgba(33, 96, 253, 0.3)'
      }}>
        {/* Hitha / SDK Logo Mark */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
        <span style={{ fontSize: '13px', fontWeight: 700 }}>HITHA SDK</span>
      </div>
    </div>
  );
}

// 3. HITHA Core & SFU Node
function HithaCoreNode({ data }: { data: any }) {
  return (
    <div style={{
      background: '#ffffff',
      border: '2px solid #2160fd',
      borderRadius: '16px',
      padding: '24px 20px',
      boxShadow: '0 12px 32px -6px rgba(33, 96, 253, 0.15)',
      minWidth: '260px',
      textAlign: 'center'
    }}>
      {/* Official HITHA Brand Cross & Shield SVG Model */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
        <svg width="50" height="50" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" rx="22" fill="#2160fd" />
          {/* Medical Cross + Tech Nodes */}
          <rect x="42" y="24" width="16" height="52" rx="4" fill="#ffffff" />
          <rect x="24" y="42" width="52" height="16" rx="4" fill="#ffffff" />
          <circle cx="50" cy="50" r="4" fill="#2160fd" />
        </svg>
      </div>

      <div style={{ fontSize: '12px', fontWeight: 800, color: '#2160fd', letterSpacing: '0.08em' }}>CLOUD PLATFORM</div>
      <div style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: '2px 0 4px' }}>HITHA CORE</div>
      <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '16px' }}>REST APIs &amp; LiveKit SFU</div>

      <div style={{
        background: '#f8faff',
        border: '1px solid #dbeafe',
        borderRadius: '10px',
        padding: '12px',
        fontSize: '11.5px',
        color: '#475569',
        lineHeight: 1.45,
        fontWeight: 500
      }}>
        Persistent connection established for media and diagnostic data
      </div>
    </div>
  );
}

const initialNodes = [
  { id: 'backend', type: 'backendNode', position: { x: 40, y: 30 }, data: {} },
  { id: 'app', type: 'clientAppNode', position: { x: 40, y: 250 }, data: {} },
  { id: 'hitha', type: 'hithaNode', position: { x: 580, y: 60 }, data: {} },
];

const initialEdges = [
  {
    id: 'e1-create',
    source: 'backend',
    target: 'hitha',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: true,
    label: '① Create meeting using REST API',
    style: { stroke: '#2160fd', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#2160fd' },
  },
  {
    id: 'e2-return-id',
    source: 'hitha',
    target: 'backend',
    animated: false,
    label: 'Returns meeting ID',
    style: { stroke: '#64748b', strokeWidth: 1.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#64748b' },
  },
  {
    id: 'e3-add-participant',
    source: 'backend',
    target: 'hitha',
    animated: true,
    label: '② Add participant / Generate auth token',
    style: { stroke: '#2160fd', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#2160fd' },
  },
  {
    id: 'e4-send-token',
    source: 'backend',
    target: 'app',
    animated: true,
    label: '③ Auth token sent',
    style: { stroke: '#16a34a', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#16a34a' },
  },
  {
    id: 'e5-webrtc-stream',
    source: 'app',
    target: 'hitha',
    animated: true,
    label: '④ Persistent WebRTC Audio/Video Connection',
    style: { stroke: '#2160fd', strokeWidth: 2.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#2160fd' },
  },
];

export default function ServerIntegrationFlow(): React.JSX.Element {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = useMemo(() => ({
    backendNode: BackendNode,
    clientAppNode: ClientAppNode,
    hithaNode: HithaCoreNode,
  }), []);

  return (
    <div style={{
      width: '100%',
      height: '460px',
      background: '#f8fbff',
      borderRadius: '16px',
      border: '1px solid #e2eaf8',
      margin: '24px 0 32px',
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
      </ReactFlow>
    </div>
  );
}
