import React, { useMemo } from 'react';
import FlowDiagram from './FlowDiagram';
import { Node, Edge, MarkerType } from '@xyflow/react';
import { FlowNodeData } from './FlowDiagram/types';

export default function RegistrationFlow(): React.JSX.Element {
  const initialNodes: Node<FlowNodeData>[] = useMemo(
    () => [
      {
        id: 'patient',
        type: 'logoNode',
        position: { x: 40, y: 130 },
        data: {
          label: 'Mobile App',
          caption: 'User Registration',
          logo: 'mobile-app',
          accentColor: '#2563eb',
          details: {
            className: 'RegisterRequestDTO.java',
            description: 'Patient submits phone number, password, and personal details.',
            config: 'POST /api/v1/auth/register',
          },
        },
      },
      {
        id: 'auth',
        type: 'logoNode',
        position: { x: 280, y: 130 },
        data: {
          label: 'Spring Security',
          caption: 'BCrypt Strength 12',
          logo: 'spring-boot',
          badge: 'RBAC',
          badgeColor: '#16a34a',
          accentColor: '#16a34a',
          details: {
            className: 'AuthenticationManager.java',
            description: 'Validates phone OTP, hashes password with BCrypt, and assigns ROLE_PATIENT.',
            config: 'BCryptPasswordEncoder(12)',
          },
        },
      },
      {
        id: 'postgres',
        type: 'logoNode',
        position: { x: 540, y: 130 },
        data: {
          label: 'PostgreSQL 16',
          caption: 'Users & Wallet Row',
          logo: 'postgresql',
          accentColor: '#0284c7',
          details: {
            className: 'UserRepository.java',
            description: 'Persists user record and initializes companion wallet with 0.00 LKR balance.',
            config: 'Table: users, wallets',
          },
        },
      },
    ],
    []
  );

  const initialEdges: Edge[] = useMemo(
    () => [
      {
        id: 'e-reg-auth',
        source: 'patient',
        target: 'auth',
        animated: true,
        label: 'Register & OTP',
        style: { stroke: '#2563eb', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#2563eb' },
      },
      {
        id: 'e-auth-pg',
        source: 'auth',
        target: 'postgres',
        animated: true,
        label: 'Commit User & Role',
        style: { stroke: '#0284c7', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#0284c7' },
      },
    ],
    []
  );

  const steps = ['e-reg-auth', 'e-auth-pg'];

  return (
    <FlowDiagram
      initialNodes={initialNodes}
      initialEdges={initialEdges}
      height={340}
      steps={steps}
      caption="Figure 3.0: User Registration & Role Enforcement Architecture"
    />
  );
}
