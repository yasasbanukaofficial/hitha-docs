---
id: dual-plane-architecture
title: Enterprise Dual-Plane Logging & Storage Architecture
sidebar_label: Dual-Plane Architecture
slug: /logging-audit/dual-plane-architecture
---


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

### The Dual-Plane Philosophy

Instead of dumping every log into one database or one disk file, we split traffic based on its business and legal purpose:

- **Plane A (Operational Telemetry)**: High-frequency operational logs (stack traces, SQL queries, Redis cache misses, bot probes) are written to local rolling files. They are compressed into GZIP hourly or at 100MB, and automatically deleted after 14 days or when the directory reaches 5GB.
- **Plane B (Compliance Audit Ledger)**: State-changing legal, clinical, and financial actions are written to PostgreSQL with cryptographic SHA-256 hash chaining.
- **Hot vs Cold Lifecycle**: The database keeps only a **90-Day Hot Window** for instant admin querying. Partitions older than 90 days are extracted to Cloudflare R2 object storage as compressed `.jsonl.gz` with cryptographic SHA-256 manifests, and the database partition is dropped in less than 10 milliseconds.
