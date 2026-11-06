import React, { useMemo, useState } from 'react';
import FlowDiagram from './FlowDiagram';
import { Node, Edge, MarkerType } from '@xyflow/react';
import { FlowNodeData } from './FlowDiagram/types';

// ==========================================
// LOG-01 FLOW COMPONENT
// ==========================================
export function Log01Flow(): React.JSX.Element {
  const initialNodes: Node<FlowNodeData>[] = useMemo(
    () => [
      {
        id: 'http',
        type: 'logoNode',
        position: { x: 30, y: 120 },
        data: {
          label: 'HTTP Request',
          caption: 'Spring Boot 3.3',
          logo: 'spring-boot',
          accentColor: '#16a34a',
          details: {
            className: 'WebMvcConfig.java',
            description: 'Incoming REST request received by virtual thread.',
          },
        },
      },
      {
        id: 'filter',
        type: 'infoNode',
        position: { x: 200, y: 40 },
        data: {
          label: 'CORRELATION FILTER',
          caption: '5 MDC Dimensions',
          infoTitle: '5 MDC FIELDS',
          infoValue: 'corrId, actor, role, IP, juris',
          accentColor: '#2563eb',
          details: {
            className: 'CorrelationIdFilter.java',
            description: 'Appends 5 diagnostic tags to MDC context.',
            config: 'X-Correlation-Id',
          },
        },
      },
      {
        id: 'logger',
        type: 'logoNode',
        position: { x: 390, y: 120 },
        data: {
          label: 'SLF4J Logger',
          caption: 'Logger.info(...)',
          logo: 'logback',
          accentColor: '#2563eb',
          details: {
            className: 'LoggerFactory.getLogger',
            description: 'Dispatches logging event to Logback engine.',
          },
        },
      },
      {
        id: 'resp',
        type: 'infoNode',
        position: { x: 390, y: 270 },
        data: {
          label: 'RESPONSE SENT',
          caption: 'Zero Thread Blocking',
          infoTitle: 'NON-BLOCKING',
          infoValue: 'Thread returns instantly',
          accentColor: '#16a34a',
        },
      },
      {
        id: 'async',
        type: 'infoNode',
        position: { x: 570, y: 130 },
        data: {
          label: 'RING BUFFER',
          caption: '8,192 Events',
          infoTitle: 'ASYNC BUFFER',
          infoValue: '8,192 event ring buffer',
          accentColor: '#d97706',
          details: {
            className: 'logback-spring.xml',
            description: 'In-memory ring buffer preventing disk I/O pauses.',
            config: 'queueSize=8192',
          },
        },
      },
      {
        id: 'disk',
        type: 'infoNode',
        position: { x: 770, y: 130 },
        data: {
          label: 'EPHEMERAL DISK',
          caption: '100MB/h • 5GB Cap',
          infoTitle: 'DISK EVICITON',
          infoValue: '5GB hard cap • 14d',
          accentColor: '#0284c7',
        },
      },
    ],
    []
  );

  const initialEdges: Edge[] = useMemo(
    () => [
      {
        id: 'e1',
        source: 'http',
        target: 'filter',
        animated: true,
        label: 'Trace Headers',
        style: { stroke: '#2563eb', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#2563eb' },
      },
      {
        id: 'e2',
        source: 'filter',
        target: 'logger',
        animated: true,
        label: 'MDC populated',
        style: { stroke: '#2563eb', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#2563eb' },
      },
      {
        id: 'e3',
        source: 'logger',
        target: 'async',
        animated: true,
        label: 'Enqueue async',
        style: { stroke: '#d97706', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#d97706' },
      },
      {
        id: 'e-nonblock',
        source: 'logger',
        target: 'resp',
        animated: true,
        label: 'Non-blocking return',
        style: { stroke: '#16a34a', strokeWidth: 1.5, strokeDasharray: '4 4' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#16a34a' },
      },
      {
        id: 'e4',
        source: 'async',
        target: 'disk',
        animated: true,
        label: 'GZIP write',
        style: { stroke: '#0284c7', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#0284c7' },
      },
    ],
    []
  );

  return (
    <FlowDiagram
      initialNodes={initialNodes}
      initialEdges={initialEdges}
      height={380}
      steps={['e1', 'e2', 'e3', 'e-nonblock', 'e4']}
      caption="LOG-01: Non-Blocking Async Logback Ring Buffer & Rolling Policy Pipeline"
    />
  );
}

// ==========================================
// LOG-02 FLOW COMPONENT (With Before / After Toggle)
// ==========================================
export function Log02Flow(): React.JSX.Element {
  const [showAfter, setShowAfter] = useState(true);

  const beforeNodes: Node<FlowNodeData>[] = [
    {
      id: 'vt',
      type: 'logoNode',
      position: { x: 50, y: 100 },
      data: {
        label: '20 Virtual Threads',
        caption: 'Burst Concurrency',
        logo: 'java',
        accentColor: '#dc2626',
      },
    },
    {
      id: 'fork',
      type: 'infoNode',
      position: { x: 300, y: 110 },
      data: {
        label: 'RACE CONDITION',
        caption: 'Same prev_hash read',
        infoTitle: 'CHAIN FORK',
        infoValue: 'Duplicate prev_hash detected!',
        accentColor: '#dc2626',
      },
    },
    {
      id: 'b1',
      type: 'infoNode',
      position: { x: 550, y: 40 },
      data: {
        label: 'Fork Block A',
        caption: 'prev_hash = #a1',
        infoTitle: 'FORKED BLOCK A',
        infoValue: 'Invalid Hash Integrity',
        accentColor: '#dc2626',
      },
    },
    {
      id: 'b2',
      type: 'infoNode',
      position: { x: 550, y: 170 },
      data: {
        label: 'Fork Block B',
        caption: 'prev_hash = #a1',
        infoTitle: 'FORKED BLOCK B',
        infoValue: 'Audit Trail Corrupted',
        accentColor: '#dc2626',
      },
    },
  ];

  const beforeEdges: Edge[] = [
    { id: 'eb1', source: 'vt', target: 'fork', animated: true, style: { stroke: '#dc2626', strokeWidth: 2 } },
    { id: 'eb2', source: 'fork', target: 'b1', animated: true, style: { stroke: '#dc2626', strokeWidth: 2 } },
    { id: 'eb3', source: 'fork', target: 'b2', animated: true, style: { stroke: '#dc2626', strokeWidth: 2 } },
  ];

  const afterNodes: Node<FlowNodeData>[] = [
    {
      id: 'vt-after',
      type: 'logoNode',
      position: { x: 40, y: 110 },
      data: {
        label: '20 Virtual Threads',
        caption: 'Java 21 Concurrency',
        logo: 'java',
        accentColor: '#16a34a',
      },
    },
    {
      id: 'lock',
      type: 'infoNode',
      position: { x: 240, y: 120 },
      data: {
        label: 'ReentrantLock',
        caption: 'hashChainLock',
        infoTitle: 'CRITICAL SECTION',
        infoValue: 'ReentrantLock.lock()',
        accentColor: '#16a34a',
      },
    },
    {
      id: 'pg',
      type: 'logoNode',
      position: { x: 460, y: 110 },
      data: {
        label: 'PostgreSQL 16',
        caption: 'Linear Sequential Hash',
        logo: 'postgresql',
        badge: '0 Forks',
        badgeColor: '#16a34a',
        accentColor: '#0284c7',
      },
    },
    {
      id: 'chain',
      type: 'infoNode',
      position: { x: 670, y: 120 },
      data: {
        label: 'CRYPTOGRAPHIC CHAIN',
        caption: 'Verified Integrity',
        infoTitle: 'BLOCK N-1 ➔ N ➔ N+1',
        infoValue: '20 Threads Verified ✔',
        accentColor: '#16a34a',
      },
    },
  ];

  const afterEdges: Edge[] = [
    {
      id: 'ea1',
      source: 'vt-after',
      target: 'lock',
      animated: true,
      label: 'Acquire lock',
      style: { stroke: '#16a34a', strokeWidth: 2 },
    },
    {
      id: 'ea2',
      source: 'lock',
      target: 'pg',
      animated: true,
      label: 'findLatest & save',
      style: { stroke: '#0284c7', strokeWidth: 2 },
    },
    {
      id: 'ea3',
      source: 'pg',
      target: 'chain',
      animated: true,
      label: 'prev_hash verified',
      style: { stroke: '#16a34a', strokeWidth: 2 },
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <button
          onClick={() => setShowAfter(false)}
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            border: '1px solid #dc2626',
            background: !showAfter ? '#dc2626' : '#ffffff',
            color: !showAfter ? '#ffffff' : '#dc2626',
            fontWeight: 700,
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          BEFORE: Concurrency Race &amp; Forking (Red)
        </button>
        <button
          onClick={() => setShowAfter(true)}
          style={{
            padding: '6px 14px',
            borderRadius: 6,
            border: '1px solid #16a34a',
            background: showAfter ? '#16a34a' : '#ffffff',
            color: showAfter ? '#ffffff' : '#16a34a',
            fontWeight: 700,
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          AFTER: ReentrantLock Linear Chain (Green)
        </button>
      </div>

      <FlowDiagram
        initialNodes={showAfter ? afterNodes : beforeNodes}
        initialEdges={showAfter ? afterEdges : beforeEdges}
        height={320}
        caption={showAfter ? 'LOG-02 AFTER: Guaranteed Linear Hash Chain (Commit 0dcb3b6)' : 'LOG-02 BEFORE: Virtual Thread Race Conditions Causing Forked Chains'}
      />
    </div>
  );
}

// ==========================================
// LOG-03 FLOW COMPONENT
// ==========================================
export function Log03Flow(): React.JSX.Element {
  const initialNodes: Node<FlowNodeData>[] = useMemo(
    () => [
      {
        id: 'attacker',
        type: 'logoNode',
        position: { x: 30, y: 120 },
        data: {
          label: '401 DoS Flood',
          caption: 'Unauthenticated Bursts',
          logo: 'client-ingress',
          badge: 'Attack',
          badgeColor: '#dc2626',
          accentColor: '#dc2626',
        },
      },
      {
        id: 'decision',
        type: 'decisionNode',
        position: { x: 240, y: 130 },
        data: {
          label: 'Sliding Window',
          question: 'IP reqs ≤ 5 / min?',
        },
      },
      {
        id: 'hikari',
        type: 'infoNode',
        position: { x: 490, y: 50 },
        data: {
          label: 'HIKARICP POOL',
          caption: '8 Protected Connections',
          infoTitle: 'HIKARICP (8 CONNS)',
          infoValue: 'Normal traffic safe',
          accentColor: '#16a34a',
        },
      },
      {
        id: 'pg',
        type: 'logoNode',
        position: { x: 710, y: 40 },
        data: {
          label: 'PostgreSQL 16',
          caption: 'Legal Audit Row',
          logo: 'postgresql',
          accentColor: '#0284c7',
        },
      },
      {
        id: 'planeA',
        type: 'infoNode',
        position: { x: 490, y: 210 },
        data: {
          label: 'PLANE A (DISK ONLY)',
          caption: 'No JDBC Connection Acquired',
          infoTitle: 'BLOCKED AT FILTER',
          infoValue: 'Zero DB Connection Impact',
          accentColor: '#dc2626',
        },
      },
    ],
    []
  );

  const initialEdges: Edge[] = useMemo(
    () => [
      {
        id: 'e-att',
        source: 'attacker',
        target: 'decision',
        animated: true,
        label: '401 Unauthorized',
        style: { stroke: '#dc2626', strokeWidth: 2 },
      },
      {
        id: 'e-yes',
        source: 'decision',
        sourceHandle: 'yes',
        target: 'hikari',
        animated: true,
        label: 'YES (≤ 5/min)',
        style: { stroke: '#16a34a', strokeWidth: 2 },
      },
      {
        id: 'e-hikari-pg',
        source: 'hikari',
        target: 'pg',
        animated: true,
        label: 'Acquire connection',
        style: { stroke: '#0284c7', strokeWidth: 2 },
      },
      {
        id: 'e-no',
        source: 'decision',
        sourceHandle: 'no',
        target: 'planeA',
        animated: true,
        label: 'NO (> 5/min flood)',
        style: { stroke: '#dc2626', strokeWidth: 2.5 },
      },
    ],
    []
  );

  return (
    <FlowDiagram
      initialNodes={initialNodes}
      initialEdges={initialEdges}
      height={350}
      steps={['e-att', 'e-yes', 'e-hikari-pg', 'e-no']}
      caption="LOG-03: HikariCP 8-Connection Pool Protection Against 401 Floods"
    />
  );
}

// ==========================================
// LOG-04 FLOW COMPONENT
// ==========================================
export function Log04Flow(): React.JSX.Element {
  const initialNodes: Node<FlowNodeData>[] = useMemo(
    () => [
      {
        id: 'dashboard',
        type: 'logoNode',
        position: { x: 30, y: 120 },
        data: {
          label: 'Admin Dashboard',
          caption: 'Activity Log Stats',
          logo: 'spring-boot',
          accentColor: '#2563eb',
        },
      },
      {
        id: 'decision',
        type: 'decisionNode',
        position: { x: 250, y: 130 },
        data: {
          label: 'Cache Evaluation',
          question: 'TTL Cache Hit? (60s)',
        },
      },
      {
        id: 'hit',
        type: 'infoNode',
        position: { x: 480, y: 50 },
        data: {
          label: 'CACHE HIT (< 50ms)',
          caption: 'In-Memory Caffeine',
          infoTitle: 'INSTANT RESPONSE',
          infoValue: '< 50ms (Zero DB Queries)',
          accentColor: '#16a34a',
        },
      },
      {
        id: 'miss',
        type: 'logoNode',
        position: { x: 480, y: 190 },
        data: {
          label: 'PostgreSQL 16',
          caption: 'BRIN Index (18MB)',
          logo: 'postgresql',
          badge: '18 MB',
          badgeColor: '#0284c7',
          accentColor: '#0284c7',
        },
      },
    ],
    []
  );

  const initialEdges: Edge[] = useMemo(
    () => [
      {
        id: 'e1',
        source: 'dashboard',
        target: 'decision',
        animated: true,
        label: 'GET /admin/stats',
        style: { stroke: '#2563eb', strokeWidth: 2 },
      },
      {
        id: 'e-hit',
        source: 'decision',
        sourceHandle: 'yes',
        target: 'hit',
        animated: true,
        label: 'HIT (TTL < 60s)',
        style: { stroke: '#16a34a', strokeWidth: 2 },
      },
      {
        id: 'e-miss',
        source: 'decision',
        sourceHandle: 'no',
        target: 'miss',
        animated: true,
        label: 'MISS ➔ BRIN Scan',
        style: { stroke: '#d97706', strokeWidth: 2 },
      },
    ],
    []
  );

  return (
    <FlowDiagram
      initialNodes={initialNodes}
      initialEdges={initialEdges}
      height={350}
      steps={['e1', 'e-hit', 'e-miss']}
      caption="LOG-04: PostgreSQL BRIN Index Optimization & 60-Second In-Memory Stats Cache"
    />
  );
}

// ==========================================
// LOG-05 FLOW COMPONENT
// ==========================================
export function Log05Flow(): React.JSX.Element {
  const initialNodes: Node<FlowNodeData>[] = useMemo(
    () => [
      {
        id: 'postgres',
        type: 'logoNode',
        position: { x: 30, y: 110 },
        data: {
          label: 'PostgreSQL 16',
          caption: 'Records > 90 Days',
          logo: 'postgresql',
          accentColor: '#0284c7',
        },
      },
      {
        id: 'archiver',
        type: 'infoNode',
        position: { x: 240, y: 120 },
        data: {
          label: 'AuditLogArchiveService',
          caption: 'Streamed Compression',
          infoTitle: 'STREAM EXPORT',
          infoValue: '.jsonl.gz + SHA-256',
          accentColor: '#16a34a',
        },
      },
      {
        id: 'r2',
        type: 'logoNode',
        position: { x: 490, y: 110 },
        data: {
          label: 'Cloudflare R2',
          caption: 'WORM Object Lock',
          logo: 'cloudflare-r2',
          badge: '7-Yr Lock',
          badgeColor: '#ea580c',
          accentColor: '#ea580c',
        },
      },
      {
        id: 'verify',
        type: 'infoNode',
        position: { x: 740, y: 120 },
        data: {
          label: 'INTEGRITY VERIFY',
          caption: 'Cryptographic Audit',
          infoTitle: 'MANIFEST MATCH',
          infoValue: 'SHA-256 Verified ✔',
          accentColor: '#2563eb',
        },
      },
    ],
    []
  );

  const initialEdges: Edge[] = useMemo(
    () => [
      {
        id: 'e1',
        source: 'postgres',
        target: 'archiver',
        animated: true,
        label: 'Stream 90d+ logs',
        style: { stroke: '#0284c7', strokeWidth: 2 },
      },
      {
        id: 'e2',
        source: 'archiver',
        target: 'r2',
        animated: true,
        label: 'Upload immutable bundle',
        style: { stroke: '#ea580c', strokeWidth: 2 },
      },
      {
        id: 'e3',
        source: 'r2',
        target: 'verify',
        animated: true,
        label: 'Verify hash manifest',
        style: { stroke: '#2563eb', strokeWidth: 1.5, strokeDasharray: '4 4' },
      },
    ],
    []
  );

  return (
    <FlowDiagram
      initialNodes={initialNodes}
      initialEdges={initialEdges}
      height={330}
      steps={['e1', 'e2', 'e3']}
      caption="LOG-05: Cold Storage Archival to Cloudflare R2 with SHA-256 Integrity Verification"
    />
  );
}
