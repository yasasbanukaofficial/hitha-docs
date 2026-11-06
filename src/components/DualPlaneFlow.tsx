import React, { useMemo } from 'react';
import FlowDiagram from './FlowDiagram';
import { Node, Edge, MarkerType } from '@xyflow/react';
import { FlowNodeData } from './FlowDiagram/types';

export default function DualPlaneFlow(): React.JSX.Element {
  const initialNodes: Node<FlowNodeData>[] = useMemo(
    () => [
      {
        id: 'spring',
        type: 'logoNode',
        position: { x: 40, y: 150 },
        data: {
          label: 'Spring Boot 3.3',
          caption: 'Virtual Threads + MDC',
          logo: 'spring-boot',
          accentColor: '#16a34a',
          details: {
            className: 'CorrelationIdFilter.java',
            description: 'Enriches thread MDC with 5 diagnostic dimensions before dispatching downstream.',
            config: 'spring.threads.virtual.enabled=true',
          },
        },
      },
      {
        id: 'planeA-group',
        type: 'groupNode',
        position: { x: 260, y: 30 },
        data: {
          label: 'Plane A: Operational Logs',
          groupTitle: 'Plane A: Operational Logs (Ephemeral Disk)',
          planeColor: '#2563eb',
        },
      },
      {
        id: 'logback',
        type: 'logoNode',
        position: { x: 300, y: 70 },
        data: {
          label: 'Logback Async',
          caption: '8,192 Ring Buffer',
          logo: 'logback',
          accentColor: '#2563eb',
          details: {
            className: 'logback-spring.xml',
            description: 'Non-blocking appender preventing request threads from pausing on disk IO.',
            config: 'queueSize=8192 • discardingThreshold=0',
          },
        },
      },
      {
        id: 'disk',
        type: 'infoNode',
        position: { x: 500, y: 90 },
        data: {
          label: 'Local File Rolling',
          caption: '100MB/hourly • 5GB Cap',
          infoTitle: 'LOCAL DISK CAP',
          infoValue: '5GB / 14d Auto-Evict',
          accentColor: '#2563eb',
          details: {
            className: 'SizeAndTimeBasedRollingPolicy',
            description: 'Compresses older logs into gzip archives and deletes when 5GB limit is reached.',
            config: 'totalSizeCap=5GB • maxHistory=14',
          },
        },
      },
      {
        id: 'planeB-group',
        type: 'groupNode',
        position: { x: 260, y: 220 },
        data: {
          label: 'Plane B: Compliance Audit',
          groupTitle: 'Plane B: Legal & Clinical Audit (WORM & DB)',
          planeColor: '#0284c7',
        },
      },
      {
        id: 'postgres',
        type: 'logoNode',
        position: { x: 300, y: 260 },
        data: {
          label: 'PostgreSQL 16',
          caption: 'SHA-256 Hash Chain',
          logo: 'postgresql',
          accentColor: '#0284c7',
          details: {
            className: 'AuditLogServiceImpl.java',
            description: 'Stores tamper-evident cryptographic chain with BRIN indexes for 90-day retention.',
            config: 'BRIN pages_per_range=128',
          },
        },
      },
      {
        id: 'cloudflare',
        type: 'logoNode',
        position: { x: 500, y: 260 },
        data: {
          label: 'Cloudflare R2',
          caption: 'WORM Object Lock',
          logo: 'cloudflare-r2',
          badge: '7-Year Lock',
          badgeColor: '#ea580c',
          accentColor: '#ea580c',
          details: {
            className: 'AuditLogArchiveServiceImpl.java',
            description: 'Cold storage bucket with S3-compatible Object Lock preventing deletion for 7 years.',
            config: 'Hive Partition: year=YYYY/month=MM',
          },
        },
      },
    ],
    []
  );

  const initialEdges: Edge[] = useMemo(
    () => [
      {
        id: 'e-spring-logback',
        source: 'spring',
        target: 'logback',
        animated: true,
        label: 'Debug & Trace events',
        style: { stroke: '#2563eb', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#2563eb' },
      },
      {
        id: 'e-logback-disk',
        source: 'logback',
        target: 'disk',
        animated: true,
        label: 'Async write',
        style: { stroke: '#2563eb', strokeWidth: 1.8 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#2563eb' },
      },
      {
        id: 'e-spring-pg',
        source: 'spring',
        target: 'postgres',
        animated: true,
        label: 'Legal Audit records',
        style: { stroke: '#0284c7', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#0284c7' },
      },
      {
        id: 'e-pg-cf',
        source: 'postgres',
        target: 'cloudflare',
        animated: true,
        label: '> 90 days cold migration',
        style: { stroke: '#ea580c', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ea580c' },
      },
    ],
    []
  );

  const steps = ['e-spring-logback', 'e-logback-disk', 'e-spring-pg', 'e-pg-cf'];

  return (
    <FlowDiagram
      initialNodes={initialNodes}
      initialEdges={initialEdges}
      height={430}
      steps={steps}
      caption="Figure 1.0: Enterprise Dual-Plane Logging & Archival Architecture"
    />
  );
}
