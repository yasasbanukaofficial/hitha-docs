import React from 'react';
import FlowDiagram from './FlowDiagram';
import { Node, Edge } from '@xyflow/react';

const topologyNodes: Node[] = [
  {
    id: 'client',
    type: 'logoNode',
    data: {
      logo: 'mobile-app',
      title: 'Client Ingress',
      caption: 'Flutter & Next.js UI Kit',
      badge: 'JWT / TLS',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'spring',
    type: 'logoNode',
    data: {
      logo: 'spring-boot',
      title: 'Spring Boot 3.3',
      caption: 'Java 21 Virtual Threads',
      badge: 'Core Engine',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'redis',
    type: 'logoNode',
    data: {
      logo: 'redis',
      title: 'Redis 7.2 Cluster',
      caption: 'Doctor Pools & Bucket4j',
      badge: 'In-Memory',
      badgeColor: '#dc2626',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'postgres',
    type: 'logoNode',
    data: {
      logo: 'postgresql',
      title: 'PostgreSQL 16',
      caption: 'BRIN Indexes & Row Locks',
      badge: 'Primary DB',
      badgeColor: '#0284c7',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'livekit',
    type: 'logoNode',
    data: {
      logo: 'livekit',
      title: 'LiveKit SFU',
      caption: 'Sub-200ms WebRTC Media',
      badge: 'Cluster',
      badgeColor: '#2160fd',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'r2',
    type: 'logoNode',
    data: {
      logo: 'cloudflare-r2',
      title: 'Cloudflare R2',
      caption: '7-Year WORM Cold Vault',
      badge: 'S3 Archival',
      badgeColor: '#f97316',
    },
    position: { x: 0, y: 0 },
  },
];

const topologyEdges: Edge[] = [
  {
    id: 'e-client-spring',
    source: 'client',
    target: 'spring',
    label: 'REST & SSE',
    animated: true,
    style: { stroke: '#00a8b5', strokeWidth: 2 },
  },
  {
    id: 'e-spring-redis',
    source: 'spring',
    target: 'redis',
    label: 'Rate Limiting & Locks',
    animated: true,
    style: { stroke: '#dc2626', strokeWidth: 2 },
  },
  {
    id: 'e-spring-postgres',
    source: 'spring',
    target: 'postgres',
    label: 'ACID Transactions',
    animated: true,
    style: { stroke: '#0284c7', strokeWidth: 2 },
  },
  {
    id: 'e-spring-livekit',
    source: 'spring',
    target: 'livekit',
    label: 'Room Tokens',
    animated: true,
    style: { stroke: '#2160fd', strokeWidth: 2 },
  },
  {
    id: 'e-postgres-r2',
    source: 'postgres',
    target: 'r2',
    label: 'Cold Stream .jsonl.gz',
    style: { stroke: '#f97316', strokeWidth: 2, strokeDasharray: '4,4' },
  },
];

const topologySteps = [
  { step: 1, nodeId: 'client', description: 'Patient initiates appointment or emergency call via mobile app.' },
  { step: 2, nodeId: 'spring', description: 'Spring Boot virtual thread validates JWT and assigns doctor with row lock.' },
  { step: 3, nodeId: 'redis', description: 'Redis verifies Bucket4j token bucket quota and manages doctor presence.' },
  { step: 4, nodeId: 'livekit', description: 'HITHA requests LiveKit token with dynamic room expiration.' },
  { step: 5, nodeId: 'postgres', description: 'PostgreSQL commits consultation state and hashes audit log entry.' },
  { step: 6, nodeId: 'r2', description: 'AuditLogArchiveService streams 90-day cold logs to Cloudflare R2.' },
];

export default function InteractiveTopologyFlow(): React.JSX.Element {
  return (
    <FlowDiagram
      nodes={topologyNodes}
      edges={topologyEdges}
      steps={topologySteps}
      scenario="Scenario: End-to-end request lifecycle across all 6 core infrastructure layers"
      height={460}
      caption="Interactive Healthcare Architecture Topology: Spring Boot 3.3 orchestrating Redis, PostgreSQL, LiveKit SFU, and Cloudflare R2 without minimap clutter."
      direction="LR"
    />
  );
}
