---
id: rbac-superadmin
title: Role-Based Access Control (RBAC) & Super Admin Governance
sidebar_label: RBAC & Super Admin Security
slug: /security/rbac-superadmin
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Role-Based Access Control (RBAC) & Super Admin Governance

HITHA strictly segregates user roles to guarantee patient privacy, clinical confidentiality, and financial auditability.

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

<Tabs>
<TabItem value="sinhala" label="📖 සරල සිංහලෙන් (Plain Sinhala)" default>

- **නීතිමය ගැටලුව**: GDPR සහ ශ්‍රී ලංකා PDPA නීතිය අනුව patient කෙනෙක්ට තමන්ගේ account එක සම්පූර්ණයෙන්ම delete කරන්න අයිතියක් තියෙනවා (Right-to-Erasure). හැබැයි නීතිය අනුවම Audit logs අවුරුදු 7ක් තියාගන්නත් ඕනේ. Account එක delete කරද්දී audit log එකේ තිබ්බ user details delete කළොත්, SHA-256 Hash chain එක කැඩෙනවා.
- **අපේ විසඳුම (Pseudonymous Pointer)**: Audit log table එකේ Patient ගේ නම, phone number එක ලියන්නේ නැත. ලියන්නේ Random UUID එකක් විතරයි (`patientId`). User account එක delete කළ විට, authentication table එකේ ඇති ඔහුගේ නම/ගම Shred (Delete) කර දමයි. Audit log එකේ UUID එක නොවෙනස්ව පවතින නිසා, Hash Chain එක බිඳෙන්නේ නැතිව audit verification 100% ආරක්ෂා වේ.



</TabItem>
<TabItem value="english" label="💡 Technical Defense (English)">

- **The Conflict**: Data privacy laws mandate the deletion of personally identifiable information (PII) upon patient request. However, financial and medical laws require 7-year immutable audit ledgers. Modifying an audit row to erase a name invalidates its cryptographic SHA-256 hash.
- **The Solution**: Audit tables maintain only pseudonymous UUID foreign references (`actorId`, `patientId`) without cascade delete rules. When an erasure request is executed, the user record in `auth_users` is cryptographically shredded, but the immutable audit row with its UUID remains intact, preserving continuous cryptographic hash-chain verification.



</TabItem>
</Tabs>
