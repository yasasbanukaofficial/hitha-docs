---
id: dual-plane-architecture
title: Enterprise Dual-Plane Logging & Storage Architecture
sidebar_label: Dual-Plane Architecture
slug: /logging-audit/dual-plane-architecture
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Enterprise Dual-Plane Logging & Storage Architecture

Telehealth systems generate massive amounts of telemetry: debug traces, query execution timings, client heartbeats, clinical document accesses, and payment events. Traditional single-destination logging creates two catastrophic failure modes:

1. **The Disk-Full Crash**: Writing all logs to local disk without strict rolling limits fills the server drive and crashes containers.
2. **The Database Bloat Crash**: Writing every trace, click, or authentication denial into PostgreSQL inflates table sizes to gigabytes, exhausts the 8-connection HikariCP pool, and halts clinical bookings.

To permanently solve this, HITHA enforces the **Dual-Plane Logging Strategy**.

<div className="arch-diagram-wrapper">
  <img src="/img/diagrams/dual-plane-flow.svg" alt="HITHA Dual-Plane Logging Pipeline" width="100%" />
  <div className="arch-diagram-caption">
    <span><b>Figure 1.0:</b> Dual-Plane Logging Topology &amp; Storage Separation</span>
    <span className="arch-diagram-badge">LOG-01 &amp; LOG-06</span>
  </div>
</div>

---

## 🔍 How Dual-Plane Logging Works

<Tabs>
<TabItem value="sinhala" label="📖 සරල සිංහලෙන් (Plain Sinhala)" default>

### සරලවම මෙතන වෙන්නේ මොකක්ද?

අපි Server එකේ හැදෙන logs ප්‍රධාන පාරවල් 2කට (Planes) වෙන් කරලා තියෙන්නේ:

1. **Plane A (සාමාන්‍ය Operational & Debug Logs)**:
   - Server එක ඇතුළේ වෙන හැම සාමාන්‍ය දේම (SQL timings, debug messages, error stack traces, bot probes) ලියවෙන්නේ **Server එකේ Hard Disk එකේ ඇති text files** වලටයි.
   - මේවා Database එකට දාලා DB එක පිරෙන්නේ හෝ slow වෙන්නේ නැහැ.
   - ෆයිල් එක ලොකු වෙන්න නොදී, පැයකට වරක් හෝ 100MB පිරුණු සැනින් `.gz` විදියට compress (zip) වෙනවා.
   - දින 14ක් ගියාම හෝ logs folder එක **5GB පිරුණු සැනින්** පැරණිම zip files ඉබේම delete වෙලා Hard Disk එක 100% ආරක්ෂා කරනවා.

2. **Plane B (නීතිමය සහ මුදල් ගනුදෙනු Audit Logs)**:
   - සල්ලි ගෙවීම් (PayHere), Doctor කෙනෙක් ලෙඩාගේ notes බැලීම (Clinical Access), Admin approvals වගේ අතිශය වැදගත් දේවල් විතරක් **PostgreSQL Database** එකට යනවා.
   - එකක් පසුපස එකක් අමුණන **SHA-256 Hash Chain** එකක් හැදෙනවා (කවුරුහරි DB එකට රිංගලා record එකක් හොරෙන් වෙනස් කලොත් chain එක කැඩිලා අහුවෙනවා).
   - මේවා DB එකේ තියාගන්නේ **මුල් දවස් 90 විතරයි**.
   - දවස් 90 පරණ වුණු logs **Cloudflare R2** එකට `.jsonl.gz` විදියට archive කරලා, DB එකේ partition එක තත්පරයෙන් පංගුවකින් (10ms) delete කරලා DB එක හැමදාම clean & fast තියාගන්නවා. නීතිමය අවශ්‍යතාවලට R2 එකේ අවුරුදු 7ක් ලොක් කරලා තියෙනවා.


</TabItem>
<TabItem value="english" label="💡 Plain English (No Jargon)">

### The Dual-Plane Philosophy

Instead of dumping every log into one database or one disk file, we split traffic based on its business and legal purpose:

- **Plane A (Operational Telemetry)**: High-frequency operational logs (stack traces, SQL queries, Redis cache misses, bot probes) are written to local rolling files. They are compressed into GZIP hourly or at 100MB, and automatically deleted after 14 days or when the directory reaches 5GB.
- **Plane B (Compliance Audit Ledger)**: State-changing legal, clinical, and financial actions are written to PostgreSQL with cryptographic SHA-256 hash chaining.
- **Hot vs Cold Lifecycle**: The database keeps only a **90-Day Hot Window** for instant admin querying. Partitions older than 90 days are extracted to Cloudflare R2 object storage as compressed `.jsonl.gz` with cryptographic SHA-256 manifests, and the database partition is dropped in less than 10 milliseconds.



</TabItem>
<TabItem value="technical" label="⚙️ Deep Architecture & Code">

```
Incoming Request / Webhook
   │
   ▼
[CorrelationIdFilter] ──► Injects MDC (correlationId, actorId, actorRole, clientIp, jurisdiction)
   │
   ├─► PLANE A: Operational Telemetry (SLF4J + Logback AsyncAppender)
   │      └─► Hourly / 100MB Rollover (.json.log.gz) ──► Hard 5GB Disk Cap / 14-Day Eviction ──► Vector / Grafana Loki
   │
   └─► PLANE B: Domain Audit, Financial & Clinical Compliance
          ├─► 401/403 Security Flood Guard (Caps DB writes at 5/min/IP; excess to Plane A)
          ├─► Serialized Single-Writer Hash-Chain Engine (Eliminates concurrent chain forks)
          ├─► HOT TIER: PostgreSQL Monthly Partitions (Last 90 Days, BRIN + Composite Indexes)
          └─► COLD TIER: Cloudflare R2 Archival (90 Days - 7 Years, Compressed JSONL + SHA-256 Manifest)
```

### Storage Decision Matrix

| Log Category | Storage Target | Write Mechanism | Retention Policy | Failure Mode Prevented |
|:---|:---|:---|:---|:---|
| **Operational & Debug Logs** | **Local Rolling Files (Plane A)** | AsyncAppender (8,192 ring buffer) | 14 Days / 5GB Hard Cap (Auto-evicts oldest) | Prevents container crash & local disk-full |
| **Connection & Query Telemetry** | **Local Rolling Files (Plane A)** | Non-blocking background worker | 14 Days / 5GB Cap | Zero latency added to live bookings/calls |
| **401 Unauthenticated Bot Floods** | **Local Files (after 5/min IP cap)** | Sliding window in-memory limiter | 14 Days / 5GB Cap | Prevents bot scanners exhausting HikariCP connections |
| **Financial & PayHere Ledger** | **PostgreSQL Hot Table (Plane B)** | Serialized SHA-256 Hash Chain | 90d Hot PG ➔ 7y Cold R2 (WORM) | Full legal compliance; zero table fragmentation |
| **Clinical & PHI Access Trails** | **PostgreSQL Hot Table (Plane B)** | Metadata-only async event listener | 90d Hot PG ➔ 7y Cold R2 | Zero PHI leaks; proves audit compliance |


</TabItem>
</Tabs>
