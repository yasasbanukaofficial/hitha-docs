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
        position: { x: 20, y: 25 },
        data: {
          label: 'LOG-01',
          caption: 'Logback Async Ring',
          logo: 'logback',
          badge: 'Ring Buffer',
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
        position: { x: 210, y: 25 },
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
        position: { x: 400, y: 40 },
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
        position: { x: 590, y: 25 },
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
        position: { x: 780, y: 25 },
        data: {
          label: 'LOG-05',
          caption: 'Cloudflare R2 Cold',
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
      {
        id: 'log6',
        type: 'logoNode',
        position: { x: 20, y: 215 },
        data: {
          label: 'LOG-06',
          caption: 'Virtual Thread Async',
          logo: 'java',
          badge: 'Async Decoupled',
          badgeColor: '#8b5cf6',
          accentColor: '#8b5cf6',
          details: {
            className: 'ClinicalAuditAspect.java',
            description: 'Decoupled clinical audit writes to virtualThreadExecutor, preserving MDC context.',
            config: 'Commit 19ed047',
          },
        },
      },
      {
        id: 'log7',
        type: 'logoNode',
        position: { x: 210, y: 215 },
        data: {
          label: 'LOG-07',
          caption: 'Sub-10ms Purge Job',
          logo: 'archive',
          badge: '90-Day Purge',
          badgeColor: '#059669',
          accentColor: '#059669',
          details: {
            className: 'AuditLogPartitionPurgeScheduler.java',
            description: 'Automated 90-day hot window archival and sub-10ms partition deletion.',
            config: 'Commit f770ab5',
          },
        },
      },
      {
        id: 'log8',
        type: 'logoNode',
        position: { x: 400, y: 215 },
        data: {
          label: 'LOG-08',
          caption: 'PDPA Crypto-Shredding',
          logo: 'patient',
          badge: 'Zero PHI',
          badgeColor: '#0891b2',
          accentColor: '#0891b2',
          details: {
            className: 'PatientIdentityService.java',
            description: 'Right-to-Erasure anonymization preserving stable non-reversible pseudonym pointers.',
            config: 'Commit a93a6f4',
          },
        },
      },
      {
        id: 'log9',
        type: 'logoNode',
        position: { x: 590, y: 215 },
        data: {
          label: 'LOG-09',
          caption: 'Admin Cold API',
          logo: 'admin',
          badge: 'Export API',
          badgeColor: '#ca8a04',
          accentColor: '#ca8a04',
          details: {
            className: 'AdminActivityLogController.java',
            description: 'POST /archive/export & GET /archive/download for self-service audit bundle exports.',
            config: 'Commit 95ba4a4',
          },
        },
      },
      {
        id: 'log10',
        type: 'logoNode',
        position: { x: 780, y: 215 },
        data: {
          label: 'LOG-10',
          caption: '100% Chain Verified',
          logo: 'superadmin',
          badge: 'Stress Suite',
          badgeColor: '#16a34a',
          accentColor: '#16a34a',
          details: {
            className: 'AuditArchitectureComplianceSuiteTest.java',
            description: 'End-to-end Virtual Thread stress test, GZIP JSONL serialization, and SHA-256 verification.',
            config: 'Commit c2ea39a',
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
        style: { stroke: '#d97706', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#d97706' },
      },
      {
        id: 'e4-5',
        source: 'log4',
        target: 'log5',
        animated: true,
        label: 'Cold Archive',
        style: { stroke: '#0284c7', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#0284c7' },
      },
      {
        id: 'e5-6',
        source: 'log5',
        target: 'log6',
        animated: true,
        label: 'Virtual Thread',
        style: { stroke: '#ea580c', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ea580c' },
      },
      {
        id: 'e6-7',
        source: 'log6',
        target: 'log7',
        animated: true,
        label: 'Purge Sched',
        style: { stroke: '#8b5cf6', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#8b5cf6' },
      },
      {
        id: 'e7-8',
        source: 'log7',
        target: 'log8',
        animated: true,
        label: 'Crypto-Shred',
        style: { stroke: '#059669', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#059669' },
      },
      {
        id: 'e8-9',
        source: 'log8',
        target: 'log9',
        animated: true,
        label: 'Admin API',
        style: { stroke: '#0891b2', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#0891b2' },
      },
      {
        id: 'e9-10',
        source: 'log9',
        target: 'log10',
        animated: true,
        label: '100% Green',
        style: { stroke: '#ca8a04', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ca8a04' },
      },
    ],
    []
  );

  const steps = ['e1-2', 'e2-3', 'e3-4', 'e4-5', 'e5-6', 'e6-7', 'e7-8', 'e8-9', 'e9-10'];

  return (
    <FlowDiagram
      initialNodes={initialNodes}
      initialEdges={initialEdges}
      height={420}
      steps={steps}
      scenario="Scenario: Complete lifecycle delivery verification of LOG-01 through LOG-10 (Nov 06, 2026)"
      caption="Interactive Engineering Delivery Ledger (Friday, November 06, 2026 — LOG-01 to LOG-10 Complete)"
    />
  );
}
