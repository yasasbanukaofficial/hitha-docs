---
id: rbac-superadmin
title: Role-Based Access Control (RBAC) & Super Admin Governance
sidebar_label: RBAC & Governance
slug: /security/rbac-superadmin
---

import BrowserOnly from '@docusaurus/BrowserOnly';
import FlowDiagram from '@site/src/components/FlowDiagram';
import { rbacNodes, rbacEdges } from '@site/src/components/FlowDiagram/diagramData';

# Role-Based Access Control (RBAC) & Super Admin Governance

HITHA enforces strict role boundaries across patients, verified doctors, support admins, and super admins.

<BrowserOnly fallback={<div style={{ height: '380px', background: '#f8fbff', borderRadius: '16px' }} />}>
  {() => (
    <FlowDiagram
      nodes={rbacNodes}
      edges={rbacEdges}
      height={380}
      scenario="Scenario: Enforcing role hierarchy and pseudonymous user identity"
      caption="RBAC & Governance Pipeline: Spring Security evaluates role hierarchy while pseudonymous masking eliminates sensitive identity traces from compliance audit records."
      direction="LR"
    />
  )}
</BrowserOnly>

Every authenticated principal is validated against Spring Security's SecurityContext and method security rules (`@PreAuthorize("hasRole('SUPER_ADMIN')")`).
