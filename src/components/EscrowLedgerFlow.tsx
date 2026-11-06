import React, { useMemo } from 'react';
import FlowDiagram from './FlowDiagram';
import { Node, Edge, MarkerType } from '@xyflow/react';
import { FlowNodeData } from './FlowDiagram/types';

export default function EscrowLedgerFlow(): React.JSX.Element {
  const initialNodes: Node<FlowNodeData>[] = useMemo(
    () => [
      {
        id: 'patient',
        type: 'logoNode',
        position: { x: 40, y: 130 },
        data: {
          label: 'Patient Payment',
          caption: 'PayHere Gateway',
          logo: 'mobile-app',
          badge: 'LKR 3,500',
          badgeColor: '#2563eb',
          accentColor: '#2563eb',
          details: {
            className: 'PaymentWebhookService.java',
            description: 'Validates PayHere MD5 signature and locks session payment intent.',
            config: 'Amount: LKR 3,500.00',
          },
        },
      },
      {
        id: 'escrow',
        type: 'logoNode',
        position: { x: 280, y: 130 },
        data: {
          label: 'Escrow Custody',
          caption: 'DoctorWalletService',
          logo: 'hitha',
          badge: 'Locked',
          badgeColor: '#d97706',
          accentColor: '#d97706',
          details: {
            className: 'DoctorWalletServiceImpl.java',
            description: 'Funds held in state LOCKED_IN_ESCROW during active telehealth consultation.',
            config: 'Status: LOCKED_IN_ESCROW',
          },
        },
      },
      {
        id: 'doctor-wallet',
        type: 'infoNode',
        position: { x: 560, y: 50 },
        data: {
          label: 'DOCTOR WITHDRAWABLE',
          caption: '80% Net Share',
          infoTitle: 'DOCTOR EARNING (80%)',
          infoValue: 'LKR 2,800.00',
          accentColor: '#16a34a',
          details: {
            className: 'WalletLedgerRepository.java',
            description: 'Credited directly upon consultation status transitioning to COMPLETED.',
            config: 'Ledger: CREDIT_DOCTOR_BALANCE',
          },
        },
      },
      {
        id: 'platform-fee',
        type: 'infoNode',
        position: { x: 560, y: 210 },
        data: {
          label: 'PLATFORM COMMISSION',
          caption: '20% Operational Fee',
          infoTitle: 'PLATFORM SHARE (20%)',
          infoValue: 'LKR 700.00',
          accentColor: '#2563eb',
          details: {
            className: 'PlatformRevenueService.java',
            description: 'Covers infrastructure, WebRTC media bandwidth, and compliance archival costs.',
            config: 'Ledger: CREDIT_PLATFORM_REVENUE',
          },
        },
      },
    ],
    []
  );

  const initialEdges: Edge[] = useMemo(
    () => [
      {
        id: 'e-pay-escrow',
        source: 'patient',
        target: 'escrow',
        animated: true,
        label: 'Webhook Verified (MD5)',
        style: { stroke: '#2563eb', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#2563eb' },
      },
      {
        id: 'e-escrow-doc',
        source: 'escrow',
        target: 'doctor-wallet',
        animated: true,
        label: 'Call Completed (80%)',
        style: { stroke: '#16a34a', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#16a34a' },
      },
      {
        id: 'e-escrow-platform',
        source: 'escrow',
        target: 'platform-fee',
        animated: true,
        label: 'Platform Retained (20%)',
        style: { stroke: '#2563eb', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#2563eb' },
      },
    ],
    []
  );

  const steps = ['e-pay-escrow', 'e-escrow-doc', 'e-escrow-platform'];

  return (
    <FlowDiagram
      initialNodes={initialNodes}
      initialEdges={initialEdges}
      height={360}
      steps={steps}
      caption="Figure 4.0: Doctor Escrow Custody & Double-Entry Ledger Split Pipeline"
    />
  );
}
