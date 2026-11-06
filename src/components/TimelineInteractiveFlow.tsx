import React, { useMemo } from 'react';
import FlowDiagram from './FlowDiagram';
import { Node, Edge, MarkerType } from '@xyflow/react';
import { FlowNodeData } from './FlowDiagram/types';

export default function TimelineInteractiveFlow(): React.JSX.Element {
  const initialNodes: Node<FlowNodeData>[] = useMemo(
    () => [
      {
        id: 'log1',
        type: 'logoNode',
        position: { x: 30, y: 30 },
        data: {
          label: 'LOG-01',
          caption: 'Logback Async Pipeline',
          logo: 'logback',
          badge: 'Nov 06',
          badgeColor: '#2563eb',
          accentColor: '#2563eb',
          details: {
            className: 'logback-spring.xml',
            description: 'Non-blocking AsyncAppender with 8,192 event ring buffer and 5GB totalSizeCap.',
            config: 'Commit e4af8e6',
          },
        },
      },
      {
        id: 'log2',
        type: 'logoNode',
        position: { x: 230, y: 30 },
        data: {
          label: 'LOG-02',
          caption: 'ReentrantLock Chain',
          logo: 'java',
          badge: 'Lock',
          badgeColor: '#16a34a',
          accentColor: '#16a34a',
          details: {
            className: 'AuditLogServiceImpl.java',
            description: 'Guarantees sequential hash-chain integrity during concurrent Java 21 Virtual Thread bursts.',
            config: 'Commit 0dcb3b6',
          },
        },
      },
      {
        id: 'log3',
        type: 'infoNode',
        position: { x: 430, y: 45 },
        data: {
          label: 'LOG-03',
          caption: 'HikariCP DoS Shield',
          infoTitle: 'LOG-03 POOL SHIELD',
          infoValue: 'MAX 5 401s / min',
          accentColor: '#d97706',
          details: {
            className: 'AuditAuthenticationEntryPoint.java',
            description: 'Sliding window in-memory limiter stopping 401 connection pool exhaustion.',
            config: 'Commit be9630d',
          },
        },
      },
      {
        id: 'log4',
        type: 'logoNode',
        position: { x: 630, y: 30 },
        data: {
          label: 'LOG-04',
          caption: 'PostgreSQL BRIN',
          logo: 'postgresql',
          badge: '18 MB',
          badgeColor: '#0284c7',
          accentColor: '#0284c7',
          details: {
            className: '004-optimize-audit-logs-indexes.yaml',
            description: 'Dropped 12GB GIN index for 18MB BRIN index, increasing write speed by 11.6x.',
            config: 'Commit a1194c7',
          },
        },
      },
      {
        id: 'log5',
        type: 'logoNode',
        position: { x: 830, y: 30 },
        data: {
          label: 'LOG-05',
          caption: 'Cloudflare R2 WORM',
          logo: 'cloudflare-r2',
          badge: '7-Yr Lock',
          badgeColor: '#ea580c',
          accentColor: '#ea580c',
          details: {
            className: 'AuditLogArchiveServiceImpl.java',
            description: 'Streaming historical audit records into .jsonl.gz with SHA-256 integrity manifest.',
            config: 'Commit 45cc888',
          },
        },
      },
    ],
    []
  );

  const initialEdges: Edge[] = useMemo(
    () => [
      {
        id: 'e1-2',
        source: 'log1',
        target: 'log2',
        animated: true,
        label: 'MDC ➔ Hash',
        style: { stroke: '#2563eb', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#2563eb' },
      },
      {
        id: 'e2-3',
        source: 'log2',
        target: 'log3',
        animated: true,
        label: 'Pool Guard',
        style: { stroke: '#16a34a', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#16a34a' },
      },
      {
        id: 'e3-4',
        source: 'log3',
        target: 'log4',
        animated: true,
        label: 'DB Index',
        style: { stroke: '#0284c7', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#0284c7' },
      },
      {
        id: 'e4-5',
        source: 'log4',
        target: 'log5',
        animated: true,
        label: 'Cold Archive',
        style: { stroke: '#ea580c', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ea580c' },
      },
    ],
    []
  );

  const steps = ['e1-2', 'e2-3', 'e3-4', 'e4-5'];

  return (
    <FlowDiagram
      initialNodes={initialNodes}
      initialEdges={initialEdges}
      height={320}
      steps={steps}
      caption="Interactive Engineering Delivery Ledger (Friday, November 06, 2026)"
    />
  );
}
