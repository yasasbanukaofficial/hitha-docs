import React, { useMemo } from 'react';
import FlowDiagram from './FlowDiagram';
import { Node, Edge, MarkerType } from '@xyflow/react';
import { FlowNodeData } from './FlowDiagram/types';

export default function R2ArchivalFlow(): React.JSX.Element {
  const initialNodes: Node<FlowNodeData>[] = useMemo(
    () => [
      {
        id: 'postgres',
        type: 'logoNode',
        position: { x: 40, y: 130 },
        data: {
          label: 'PostgreSQL 16',
          caption: 'Audit Records > 90 Days',
          logo: 'postgresql',
          accentColor: '#0284c7',
          details: {
            className: 'AuditLogRepository.java',
            description: 'Queries historical records using BRIN block ranges without loading memory.',
            config: 'created_at < NOW() - INTERVAL 90 DAY',
          },
        },
      },
      {
        id: 'archiver',
        type: 'logoNode',
        position: { x: 280, y: 130 },
        data: {
          label: 'Audit Archiver',
          caption: 'GZIP + SHA-256 Manifest',
          logo: 'spring-boot',
          badge: 'Stream',
          badgeColor: '#16a34a',
          accentColor: '#16a34a',
          details: {
            className: 'AuditLogArchiveServiceImpl.java',
            description: 'Streams directly into .jsonl.gz archives, calculating cryptographic SHA-256 hash.',
            config: 'GZIPOutputStream • SHA-256 digest',
          },
        },
      },
      {
        id: 'r2',
        type: 'logoNode',
        position: { x: 540, y: 130 },
        data: {
          label: 'Cloudflare R2',
          caption: '7-Year WORM Lock',
          logo: 'cloudflare-r2',
          badge: 'Locked',
          badgeColor: '#ea580c',
          accentColor: '#ea580c',
          details: {
            className: 'R2StorageClient.java',
            description: 'Uploads immutable archives with Hive partitioning: year=YYYY/month=MM/audit_logs.jsonl.gz',
            config: 'Object Lock: 7 Years Legal Hold',
          },
        },
      },
    ],
    []
  );

  const initialEdges: Edge[] = useMemo(
    () => [
      {
        id: 'e-pg-archive',
        source: 'postgres',
        target: 'archiver',
        animated: true,
        label: 'Stream 90d+ audit logs',
        style: { stroke: '#0284c7', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#0284c7' },
      },
      {
        id: 'e-archive-r2',
        source: 'archiver',
        target: 'r2',
        animated: true,
        label: 'Upload .jsonl.gz + SHA-256',
        style: { stroke: '#ea580c', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ea580c' },
      },
    ],
    []
  );

  const steps = ['e-pg-archive', 'e-archive-r2'];

  return (
    <FlowDiagram
      initialNodes={initialNodes}
      initialEdges={initialEdges}
      height={340}
      steps={steps}
      caption="Figure 5.0: Cold Data Archival Pipeline to Cloudflare R2 WORM Object Storage"
    />
  );
}
