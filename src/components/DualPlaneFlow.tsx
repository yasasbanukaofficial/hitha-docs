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

function SpringIngestNode() {
  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid #16a34a',
      borderRadius: '12px',
      padding: '12px 16px',
      minWidth: '220px',
      boxShadow: '0 4px 12px rgba(22, 163, 74, 0.08)'
    }}>
      <div style={{ fontSize: '10px', fontWeight: 800, color: '#16a34a' }}>INGESTION ENGINE</div>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Spring Boot 3.3</div>
      <div style={{ fontSize: '11px', color: '#64748b' }}>CorrelationIdFilter (5 MDC keys)</div>
    </div>
  );
}

function PlaneANode() {
  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid #2563eb',
      borderRadius: '12px',
      padding: '12px 16px',
      minWidth: '240px',
      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.08)'
    }}>
      <div style={{ fontSize: '10px', fontWeight: 800, color: '#2563eb' }}>PLANE A • EPHEMERAL DISK</div>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>High-Frequency Logs</div>
      <div style={{ fontSize: '11px', color: '#64748b' }}>100MB/1h rolling • 5GB hard cap • 14d evict</div>
    </div>
  );
}

function PlaneBNode() {
  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid #0284c7',
      borderRadius: '12px',
      padding: '12px 16px',
      minWidth: '240px',
      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.08)'
    }}>
      <div style={{ fontSize: '10px', fontWeight: 800, color: '#0284c7' }}>PLANE B • LEGAL AUDIT</div>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>PostgreSQL 16 BRIN</div>
      <div style={{ fontSize: '11px', color: '#64748b' }}>SHA-256 Hash Chained • 90-Day Retention</div>
    </div>
  );
}

function CloudflareNode() {
  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid #ea580c',
      borderRadius: '12px',
      padding: '12px 16px',
      minWidth: '220px',
      boxShadow: '0 4px 12px rgba(234, 88, 12, 0.08)'
    }}>
      <div style={{ fontSize: '10px', fontWeight: 800, color: '#ea580c' }}>COLD ARCHIVE</div>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Cloudflare R2 WORM</div>
      <div style={{ fontSize: '11px', color: '#64748b' }}>7-Year Legal Lock • Hive Partitioned</div>
    </div>
  );
}

const initialNodes = [
  { id: 'spring', type: 'springNode', position: { x: 30, y: 110 }, data: {} },
  { id: 'planeA', type: 'planeANode', position: { x: 340, y: 30 }, data: {} },
  { id: 'planeB', type: 'planeBNode', position: { x: 340, y: 190 }, data: {} },
  { id: 'r2', type: 'r2Node', position: { x: 670, y: 190 }, data: {} },
];

const initialEdges = [
  { id: 'e-a', source: 'spring', target: 'planeA', animated: true, style: { stroke: '#2563eb', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#2563eb' } },
  { id: 'e-b', source: 'spring', target: 'planeB', animated: true, style: { stroke: '#0284c7', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#0284c7' } },
  { id: 'e-r2', source: 'planeB', target: 'r2', animated: true, style: { stroke: '#ea580c', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#ea580c' } },
];

export default function DualPlaneFlow(): React.JSX.Element {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = useMemo(() => ({
    springNode: SpringIngestNode,
    planeANode: PlaneANode,
    planeBNode: PlaneBNode,
    r2Node: CloudflareNode,
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
