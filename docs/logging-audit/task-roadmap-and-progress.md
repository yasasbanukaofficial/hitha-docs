---
id: task-roadmap-and-progress
title: Logging & Audit Engineering Roadmap (LOG-01 to LOG-10)
sidebar_label: Engineering Roadmap & Slices
slug: /logging-audit/task-roadmap-and-progress
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Logging & Audit Engineering Roadmap (LOG-01 to LOG-10)

This roadmap tracks the exact engineering execution slices implementing the Enterprise Dual-Plane Logging & Audit Architecture in `HITHA-SERVER`.

<div className="arch-diagram-wrapper">
  <img src="/img/diagrams/cloudflare-r2-archival.svg" alt="Cold Storage JSONL.gz Streaming Pipeline to Cloudflare R2" width="100%" />
  <div className="arch-diagram-caption">
    <span><b>Figure 7.0:</b> Cloudflare R2 Cold Archival Pipeline &amp; SHA-256 Manifest (LOG-05)</span>
    <span className="arch-diagram-badge">LOG-05 &amp; CLOUDFLARE R2</span>
  </div>
</div>

---

## 📊 Live Execution Progress Matrix

| Task Key | Deliverable | Storage Plane & Strategy | Status | Deliverable & Evidence |
|:---|:---|:---|:---|:---|
| **LOG-01** | Structured Rolling Logback Config & MDC Filter | Plane A: Rolling Local Files (100MB/hourly `.gz`, 5GB cap) | **Testing / In Review** | `logback-spring.xml` + `CorrelationIdFilter.java`, commit `e4af8e6` |
| **LOG-02** | Thread-Safe Hash-Chain Serialization | Plane B: PostgreSQL Hot Table (`ReentrantLock`) | **Testing / In Review** | `AuditLogServiceImpl.java` (20 Virtual Threads green), commit `0dcb3b6` |
| **LOG-03** | Rate-Limited 401 Security Auditing & DoS Guard | Dual-Plane: DB (5/min/IP) + Plane A overflow | **In Development** | `AuditAuthenticationEntryPoint.java` (HikariCP protection), commit `be9630d` |
| **LOG-04** | Liquibase Index Optimization & Cached Dashboard | PostgreSQL DB: BRIN + Composite (`idx_audit_created_brin`) | **In Development** | `004-optimize-audit-logs-indexes.yaml` + 60s stats TTL cache, commit `a1194c7` |
| **LOG-05** | Cold-Storage Audit Archiver (`.jsonl.gz`) | Plane B: Cold Object Storage (WORM / Cloudflare R2) | **In Development** | `AuditLogArchiveServiceImpl.java` + SHA-256 manifest, commit `45cc888` |
| **LOG-06** | Asynchronous Clinical Audit Decoupling | Plane B: Non-blocking Spring Event Worker | **Open / Backlog** | Decouples clinical writes to async executor to guarantee zero UI latency |
| **LOG-07** | PostgreSQL Monthly Partitioning & Lifecycle Scheduler | Plane B: Monthly Partitions Maintenance Engine | **Open / Backlog** | Scheduled creation of future partitions and verified sub-10ms detachment |
| **LOG-08** | PDPA/GDPR Right-to-Erasure Pseudonymous Pointer Pattern | Compliance: Cryptographic Ledger | **Open / Backlog** | Anonymizes user profile while leaving cryptographic audit chains intact |
| **LOG-09** | Cloudflare R2 Log Exfiltration & Admin Audit Explorer UI | Frontend / Admin UI | **Open / Backlog** | Filterable audit explorer with R2 presigned download links |
| **LOG-10** | End-to-End Stress & Compliance Verification Suite | Verification: Integration & CI/CD | **Open / Backlog** | Multi-thread concurrency bursts and partition boundary rollover verification |

---

## 🛠️ Detailed Task Descriptions

<Tabs>
<TabItem value="log01" label="LOG-01: Logback & MDC" default>

### LOG-01: Structured Rolling Logback Configuration & Enriched Telemetry MDC Filter
- **Problem**: Default console logging caused high I/O blocking under Virtual Thread bursts, and unrotated files risked container disk crashes.
- **Solution**: Created `logback-spring.xml` using `AsyncAppender` backed by an 8,192-event ring buffer. Rolling files split hourly or at 100MB, compressed with GZIP, with a strict 5GB total cap and 14-day eviction.
- **Context Injection**: `CorrelationIdFilter.java` injects `correlationId`, `actorId`, `actorRole`, `clientIp`, and `jurisdiction` into SLF4J MDC with guaranteed cleanup in `finally`.
- **Commit**: `e4af8e6`



</TabItem>
<TabItem value="log02" label="LOG-02: Hash-Chain Lock">

### LOG-02: Thread-Safe Cryptographic Hash-Chain Serialization in `AuditLogServiceImpl`
- **Problem**: When 20 concurrent Java 21 Virtual Threads simultaneously executed `findLatestHashChainValue()` under PostgreSQL `READ COMMITTED`, they all read the exact same uncommitted parent hash, creating parallel hash branches and breaking audit verification.
- **Solution**: Implemented JVM `ReentrantLock` (`hashChainLock`) serializing the parent lookup, `computeHashV2()`, and repository save sequence.
- **Verification**: `AuditLogServiceConcurrencyTest` executed 20 concurrent Virtual Threads. 100% sequential chain verified with zero broken links.
- **Commit**: `0dcb3b6`



</TabItem>
<TabItem value="log03" label="LOG-03: 401 DoS Guard">

### LOG-03: Rate-Limited 401 Security Auditing & Bot Flood Protection (DoS Guard)
- **Problem**: Internet scanners hitting unauthenticated endpoints at 200 req/sec triggered synchronous database audit inserts, exhausting the 8-connection HikariCP pool and crashing the backend.
- **Solution**: Implemented an in-memory sliding window rate limiter in `AuditAuthenticationEntryPoint.java` (`MAX_DB_AUDITS_PER_IP_PER_MINUTE = 5`). Legitimate events (≤ 5/min/IP) write to PostgreSQL; excess bot floods divert to Plane A local logs (`log.warn`).
- **Verification**: `AuditAuthenticationEntryPointTest` confirmed 50 rapid requests from the same IP result in exactly 5 DB writes and 45 local log warnings.
- **Commit**: `be9630d`



</TabItem>
<TabItem value="log04" label="LOG-04: Index & Cache">

### LOG-04: Liquibase Index Optimization & Cached Admin Dashboard Telemetry
- **Problem**: An unused GIN index on `raw_payload` slowed down audit inserts by 4x–8x. Opening the Admin Dashboard executed 6 heavy unindexed `COUNT(*)` queries on every page hit.
- **Solution**: Dropped the GIN index via Liquibase migration `004-optimize-audit-logs-indexes.yaml`. Added `idx_audit_created_brin` (Block Range Index) and `idx_audit_created_action` (Composite). Implemented a 60-second in-memory TTL stats cache in `AdminActivityLogServiceImpl.java`.
- **Verification**: `AdminActivityLogServiceTest` verified zero database count scans on repeated dashboard hits within the 60s TTL window.
- **Commit**: `a1194c7`



</TabItem>
<TabItem value="log05" label="LOG-05: Cold Archiver">

### LOG-05: Cold-Storage Audit Archiver (`AuditLogArchiveService`) with GZIP & SHA-256 Manifest
- **Problem**: Unbounded growth of audit tables in active PostgreSQL degrades query memory and balloons database backups.
- **Solution**: Built `AuditLogArchiveServiceImpl.java` with `buildColdArchiveBundle(jurisdiction, from, to)`. Streams historical audit records chronologically into GZIP JSON Lines (`.jsonl.gz`), calculates a companion SHA-256 manifest, and structures object keys under Hive partitioning (`audit-archive/jurisdiction=LK/year=YYYY/month=MM/...`) for Cloudflare R2 cold storage.
- **Verification**: `AuditLogArchiveServiceTest` verified lossless GZIP decompression and SHA-256 manifest integrity.
- **Commit**: `45cc888`



</TabItem>
</Tabs>
