---
id: rbac-superadmin
title: Role-Based Access Control (RBAC) & Super Admin Governance
sidebar_label: RBAC & Governance
slug: /security/rbac-superadmin
---

# Role-Based Access Control (RBAC) & Super Admin Governance

HITHA enforces strict role boundaries across patients, verified doctors, support admins, and super admins.

<div className="dyte-diagram-container">
  <img src="/img/diagrams/user-registration-flow.svg" alt="User Registration & RBAC Lifecycle" width="100%" />
</div>

Every authenticated principal is validated against Spring Security's SecurityContext and method security rules (`@PreAuthorize("hasRole('SUPER_ADMIN')")`).
