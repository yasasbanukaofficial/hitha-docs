import React, { useMemo } from 'react';
import FlowDiagram from './FlowDiagram';
import { Node, Edge, MarkerType } from '@xyflow/react';
import { FlowNodeData } from './FlowDiagram/types';

export default function RateLimitingFlow(): React.JSX.Element {
  const initialNodes: Node<FlowNodeData>[] = useMemo(
    () => [
      {
        id: 'ingress',
        type: 'logoNode',
        position: { x: 40, y: 140 },
        data: {
          label: 'Client Ingress',
          caption: 'X-Forwarded-For IP',
          logo: 'client-ingress',
          accentColor: '#2563eb',
          details: {
            className: 'RateLimitingFilter.java',
            description: 'Extracts real client IP, validates headers, and checks token bucket availability.',
            config: 'Header: X-Forwarded-For',
          },
        },
      },
      {
        id: 'redis',
        type: 'logoNode',
        position: { x: 260, y: 140 },
        data: {
          label: 'Redis & Bucket4j',
          caption: 'atomic token replenishment',
          logo: 'redis',
          badge: 'Cluster',
          badgeColor: '#dc2626',
          accentColor: '#dc2626',
          details: {
            className: 'DistributedRateLimiterConfig.java',
            description: 'Maintains per-IP and per-token state across clustered Redis nodes with zero JVM contention.',
            config: 'Redis 7.2 • In-Memory TTL 60s',
          },
        },
      },
      {
        id: 't1',
        type: 'infoNode',
        position: { x: 540, y: 40 },
        data: {
          label: 'TIER 1 (STRICT)',
          caption: 'Auth & OTP Endpoints',
          infoTitle: 'TIER 1 (STRICT)',
          infoValue: 'Auth & OTP',
          accentColor: '#dc2626',
          details: {
            className: 'SecurityConfig.java',
            description: 'Strict rate limit for login, OTP verification, and password reset endpoints.',
            config: 'Capacity: 5 req / min',
          },
        },
      },
      {
        id: 't2',
        type: 'infoNode',
        position: { x: 540, y: 145 },
        data: {
          label: 'TIER 2 (PUBLIC)',
          caption: 'Doctors & Available Slots',
          infoTitle: 'TIER 2 (PUBLIC)',
          infoValue: 'Doctors & Slots',
          accentColor: '#2563eb',
          details: {
            className: 'DoctorDirectoryController.java',
            description: 'Protects public directory lookups and slot availability queries.',
            config: 'Capacity: 60 req / min',
          },
        },
      },
      {
        id: 't3',
        type: 'infoNode',
        position: { x: 540, y: 250 },
        data: {
          label: 'TIER 3 (AUTHENTICATED)',
          caption: 'Clinical & Webhook APIs',
          infoTitle: 'TIER 3 (AUTH)',
          infoValue: 'Clinical & Webhooks',
          accentColor: '#16a34a',
          details: {
            className: 'ClinicalSessionController.java',
            description: 'High-throughput authenticated doctor actions and PayHere payment notifications.',
            config: 'Capacity: 300 req / min',
          },
        },
      },
      {
        id: 'rejected',
        type: 'infoNode',
        position: { x: 800, y: 145 },
        data: {
          label: 'REJECTED',
          caption: 'HTTP 429 Too Many Requests',
          infoTitle: 'BURST BLOCKED',
          infoValue: 'HTTP 429 Too Many Req',
          accentColor: '#ef4444',
          details: {
            className: 'GlobalExceptionHandler.java',
            description: 'Returns RFC 7807 problem details with Retry-After header. Zero database queries triggered.',
            config: 'Status: 429 Too Many Requests',
          },
        },
      },
    ],
    []
  );

  const initialEdges: Edge[] = useMemo(
    () => [
      {
        id: 'e-ingress-redis',
        source: 'ingress',
        target: 'redis',
        animated: true,
        label: 'every request',
        style: { stroke: '#2563eb', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#2563eb' },
      },
      {
        id: 'e-redis-t1',
        source: 'redis',
        target: 't1',
        animated: true,
        label: '5 req/min',
        style: { stroke: '#dc2626', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#dc2626' },
      },
      {
        id: 'e-redis-t2',
        source: 'redis',
        target: 't2',
        animated: true,
        label: '60 req/min',
        style: { stroke: '#2563eb', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#2563eb' },
      },
      {
        id: 'e-redis-t3',
        source: 'redis',
        target: 't3',
        animated: true,
        label: '300 req/min',
        style: { stroke: '#16a34a', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#16a34a' },
      },
      {
        id: 'e-t1-reject',
        source: 't1',
        target: 'rejected',
        animated: true,
        label: 'burst exceeded',
        style: { stroke: '#ef4444', strokeWidth: 1.5, strokeDasharray: '4 4' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' },
      },
      {
        id: 'e-t2-reject',
        source: 't2',
        target: 'rejected',
        animated: true,
        label: 'burst exceeded',
        style: { stroke: '#ef4444', strokeWidth: 1.5, strokeDasharray: '4 4' },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#ef4444' },
      },
    ],
    []
  );

  const steps = ['e-ingress-redis', 'e-redis-t1', 'e-redis-t2', 'e-redis-t3', 'e-t1-reject'];

  return (
    <FlowDiagram
      initialNodes={initialNodes}
      initialEdges={initialEdges}
      height={380}
      steps={steps}
      caption="Figure 2.0: Multi-Tier Distributed Rate Limiting Pipeline (Bucket4j + Redis Cluster)"
    />
  );
}
