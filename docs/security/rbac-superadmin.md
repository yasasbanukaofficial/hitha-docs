---
id: rbac-superadmin
title: Role-Based Access Control (RBAC) & Super Admin Governance
sidebar_label: RBAC & Super Admin Security
slug: /security/rbac-superadmin
---


# Role-Based Access Control (RBAC) & Super Admin Governance

HITHA strictly segregates user roles to guarantee patient privacy, clinical confidentiality, and financial auditability.

<div className="arch-diagram-wrapper">
  <img src="/img/diagrams/user-registration-flow.svg" alt="User Registration &amp; Role Provisioning Flow" width="100%" />
  <div className="arch-diagram-caption">
    <span><b>Figure 6.0:</b> User Registration, Password Hash &amp; Role Provisioning Flow</span>
    <span className="arch-diagram-badge">SEC-04 &amp; AUTH</span>
  </div>
</div>

---

## 👥 Standardized Role Actors

| Role Badge | Actor Type | Permitted Capabilities | Strict Prohibitions |
|:---|:---|:---|:---|
| `👤 Patient` | Care Receiver | Book on-demand/scheduled sessions, view self-prescriptions, join private WebRTC room | Cannot view other patients, cannot approve doctors |
| `👨‍⚕️ Doctor` | Care Provider | Accept calls, write clinical notes, prescribe drugs, withdraw escrow earnings | Cannot access other doctors' clinical notes or unmask patient identities |
| `🛡️ Admin` | Operations Staff | Verify doctor credentials, moderate community blogs, manage category prices | Cannot access private clinical notes or initiate financial withdrawals |
| `👑 Super Admin` | Platform Governance | Manage system settings, inspect audit hash chains, process court unmasking orders | Actions are cryptographically logged and non-repudiable |

---

## 🔒 The Pseudonymous Pointer Pattern (PDPA / GDPR Right-to-Erasure)

- **The Conflict**: Data privacy laws mandate the deletion of personally identifiable information (PII) upon patient request. However, financial and medical laws require 7-year immutable audit ledgers. Modifying an audit row to erase a name invalidates its cryptographic SHA-256 hash.
- **The Solution**: Audit tables maintain only pseudonymous UUID foreign references (`actorId`, `patientId`) without cascade delete rules. When an erasure request is executed, the user record in `auth_users` is cryptographically shredded, but the immutable audit row with its UUID remains intact, preserving continuous cryptographic hash-chain verification.
