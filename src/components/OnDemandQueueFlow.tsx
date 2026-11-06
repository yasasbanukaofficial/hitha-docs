import React, { useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// 1. Patient Client Node
function PatientNode() {
  return (
    <div style={{
      position: 'relative',
      background: '#ffffff',
      border: '1.5px solid #0f172a',
      borderRadius: '14px',
      padding: '16px',
      minWidth: '220px',
      boxShadow: '0 8px 20px -4px rgba(15, 23, 42, 0.08)',
      textAlign: 'center'
    }}>
      <Handle type="source" position={Position.Right} style={{ background: '#2160fd', width: 8, height: 8 }} />

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
        {/* Mobile Phone Device Model */}
        <svg width="34" height="34" viewBox="0 0 100 100" fill="none">
          <rect x="25" y="10" width="50" height="80" rx="10" fill="#0f172a" stroke="#00a8b5" strokeWidth="3" />
          <rect x="30" y="18" width="40" height="60" rx="4" fill="#f0fdf4" />
          <circle cx="50" cy="84" r="3" fill="#ffffff" />
        </svg>
      </div>
      <div style={{ fontSize: '11px', fontWeight: 800, color: '#dc2626' }}>PATIENT IN CRISIS</div>
      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>"Call Now" Action</div>
      <div style={{
        marginTop: '8px',
        background: '#2160fd',
        color: '#ffffff',
        padding: '6px 10px',
        borderRadius: '6px',
        fontSize: '11.5px',
        fontWeight: 700
      }}>
        15m / 30m / 45m Choice
      </div>
    </div>
  );
}

// 2. Dispatch Engine (Redis + PostgreSQL Row Lock)
function DispatchEngineNode() {
  return (
    <div style={{
      position: 'relative',
      background: '#ffffff',
      border: '2px solid #2160fd',
      borderRadius: '16px',
      padding: '18px 20px',
      minWidth: '260px',
      boxShadow: '0 12px 30px -6px rgba(33, 96, 253, 0.12)',
      textAlign: 'center'
    }}>
      <Handle type="target" position={Position.Left} style={{ background: '#2160fd', width: 8, height: 8 }} />
      <Handle type="source" position={Position.Right} style={{ background: '#16a34a', width: 8, height: 8 }} />

      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
        {/* Redis Cube */}
        <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
          <path d="M50 5 L90 27 L50 49 L10 27 Z" fill="#D82C20" />
          <path d="M10 27 L50 49 L50 95 L10 73 Z" fill="#A32119" />
          <path d="M90 27 L50 49 L50 95 L90 73 Z" fill="#7A1813" />
        </svg>
        {/* Postgres Elephant */}
        <svg width="28" height="28" viewBox="0 0 100 100" fill="none">
          <path d="M50 10 C30 10 18 24 18 45 C18 64 28 85 46 90 C48 78 46 64 43 54 C39 40 48 30 57 32 C65 34 68 46 65 60 C62 72 58 84 54 90 C72 85 82 64 82 45 C82 24 70 10 50 10 Z" fill="#336791" />
        </svg>
      </div>

      <div style={{ fontSize: '11px', fontWeight: 800, color: '#2160fd' }}>DISPATCH SCHEDULER</div>
      <div style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '2px 0 8px' }}>WaitingQueueDispatcher</div>

      <div style={{
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        padding: '8px',
        fontSize: '11px',
        color: '#b91c1c',
        fontWeight: 700,
        marginBottom: '6px'
      }}>
        Pessimistic Row Lock: SELECT ... FOR UPDATE
      </div>

      <div style={{
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '6px',
        fontSize: '11px',
        color: '#475569'
      }}>
        Redis Doctor Presence Pool
      </div>
    </div>
  );
}

// 3. Duty Doctor Node
function DutyDoctorNode() {
  return (
    <div style={{
      position: 'relative',
      background: '#ffffff',
      border: '1.5px solid #16a34a',
      borderRadius: '14px',
      padding: '16px',
      minWidth: '230px',
      boxShadow: '0 8px 20px -4px rgba(22, 163, 74, 0.1)',
      textAlign: 'center'
    }}>
      <Handle type="target" position={Position.Left} style={{ background: '#16a34a', width: 8, height: 8 }} />

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
        {/* Doctor Stethoscope / Avatar SVG */}
        <svg width="36" height="36" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="35" r="20" fill="#16a34a" />
          <path d="M20 85 C20 65, 80 65, 80 85 Z" fill="#0f172a" />
          <path d="M45 45 v25 c0 8 10 8 10 0 v-25" stroke="#ffffff" strokeWidth="4" fill="none" />
          <circle cx="50" cy="72" r="5" fill="#facc15" />
        </svg>
      </div>
      <div style={{ fontSize: '11px', fontWeight: 800, color: '#16a34a' }}>DUTY DOCTOR</div>
      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>State: RINGING</div>

      <div style={{
        marginTop: '8px',
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        color: '#15803d',
        padding: '6px 10px',
        borderRadius: '6px',
        fontSize: '11.5px',
        fontWeight: 700
      }}>
        45s Acceptance Window
      </div>
      <div style={{ fontSize: '10.5px', color: '#64748b', marginTop: '6px' }}>
        If accepted: LiveKit room opens
      </div>
    </div>
  );
}

const initialNodes = [
  { id: 'patient', type: 'patientNode', position: { x: 30, y: 50 }, data: {} },
  { id: 'dispatcher', type: 'dispatcherNode', position: { x: 340, y: 30 }, data: {} },
  { id: 'doctor', type: 'doctorNode', position: { x: 680, y: 50 }, data: {} },
];

const initialEdges = [
  {
    id: 'e1',
    source: 'patient',
    target: 'dispatcher',
    animated: true,
    label: 'Enqueue emergency call',
    style: { stroke: '#2160fd', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#2160fd' },
  },
  {
    id: 'e2',
    source: 'dispatcher',
    target: 'doctor',
    animated: true,
    label: 'Rings doctor via SSE (45s)',
    style: { stroke: '#16a34a', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#16a34a' },
  },
];

export default function OnDemandQueueFlow(): React.JSX.Element {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = useMemo(() => ({
    patientNode: PatientNode,
    dispatcherNode: DispatchEngineNode,
    doctorNode: DutyDoctorNode,
  }), []);

  return (
    <div style={{
      width: '100%',
      height: '360px',
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
