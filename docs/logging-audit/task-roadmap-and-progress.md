---
id: task-roadmap-and-progress
title: Logging, Audit & Cloud Archival Roadmap
sidebar_label: Task Roadmap & Progress
slug: /logging-audit/task-roadmap-and-progress
---

import BrowserOnly from '@docusaurus/BrowserOnly';
import FlowDiagram from '@site/src/components/FlowDiagram';
import { log05Nodes, log05Edges } from '@site/src/components/FlowDiagram/diagramData';

# Logging, Audit & Cloud Archival Roadmap

This document outlines the architectural lifecycle of audit log storage, cold data migration to Cloudflare R2, and compliance governance.

<BrowserOnly fallback={<div style={{ height: '380px', background: '#f8fbff', borderRadius: '16px' }} />}>
  {() => (
    <FlowDiagram
      nodes={log05Nodes}
      edges={log05Edges}
      height={380}
      scenario="Scenario: Old audit records move to cold storage and an auditor verifies them later"
      caption="LOG-05 Archival Pipeline: Historical audit records (>90 days) are streamed to GZIP-compressed .jsonl.gz archives with SHA-256 manifests uploaded to Cloudflare R2."
      direction="LR"
    />
  )}
</BrowserOnly>

Audit logs older than 90 days are automatically exported to GZIP-compressed JSON Lines (`.jsonl.gz`), signed with a cryptographic SHA-256 manifest, and placed into Cloudflare R2 object storage with 7-year WORM lock protection.

---

## 🚀 Implementation Progress & Verification Matrix

All 10 architectural tasks (LOG-01 to LOG-10) have been engineered, verified via automated test suites, merged into `development`, and moved to **Ready for QA**.

| Task Key | Architectural Deliverable | Target Tier & Layer | Status | Verification & Git Deliverables |
|:---|:---|:---|:---|:---|
| **LOG-01** | Non-Blocking Async Rolling Logback Configuration & MDC Filter | Plane A: Rolling Local Files | **READY FOR QA** | 100MB/hourly `.gz` rotation, 5GB cap, 5 MDC tags (`e4af8e6`) |
| **LOG-02** | Thread-Safe Cryptographic Hash-Chain Serialization | Plane B: PostgreSQL Hot Table | **READY FOR QA** | JVM `ReentrantLock`, 20 Virtual Threads concurrent test green (`0dcb3b6`) |
| **LOG-03** | 401 Unauthenticated Security Audit Rate Limiting (HikariCP Shield) | Dual-Plane: DB + Plane A Spillover | **READY FOR QA** | 5/min IP cap to DB, overflow to Plane A, `AuditAuthenticationEntryPointTest` (`be9630d`) |
| **LOG-04** | Liquibase Index Optimization (BRIN) & Cached Telemetry Stats | PostgreSQL DB: BRIN + Composite | **READY FOR QA** | Drop GIN, add BRIN + composite idx, 60s stats cache TTL (`a1194c7`) |
| **LOG-05** | Cold-Storage Audit Archiver (`AuditLogArchiveService`) with GZIP & Manifest | Plane B: Cloudflare R2 (WORM) | **READY FOR QA** | Batch export to `.jsonl.gz` + SHA-256 digital manifest (`45cc888`) |
| **LOG-06** | Asynchronous Clinical Audit Decoupling in `ClinicalAuditAspect` | Plane B: Virtual Thread Worker | **READY FOR QA** | Decoupled via `virtualThreadExecutor`, MDC propagation (`19ed047`) |
| **LOG-07** | Automated Partition Archival & Sub-10ms Purge Scheduler | Plane B: Partition Maintenance Engine | **READY FOR QA** | 90-day hot window, archive bundle upload, batch purge (`f770ab5`) |
| **LOG-08** | PDPA/GDPR Right-to-Erasure with Cryptographic Pseudonym Pointers | Compliance: Cryptographic Ledger | **READY FOR QA** | Pseudonym pointer preserved, PII shredded, 100% chain valid (`a93a6f4`) |
| **LOG-09** | Cloudflare R2 Cold Log Archival Export & Admin Download API | Admin Portal: REST Endpoints | **READY FOR QA** | `POST /archive/export`, `GET /archive/download`, unit tests green (`95ba4a4`) |
| **LOG-10** | End-to-End Stress & Compliance Verification Suite | Verification: Integration & CI/CD | **READY FOR QA** | 25 concurrent Virtual Threads, 100% sequential chain validation (`c2ea39a`) |

---

## 🔒 Deep Mechanism Highlights

### 1. Concurrency-Safe Single-Writer Hash Chaining (LOG-02)
Under high concurrency, Java 21 Virtual Threads executing simultaneous audit writes can experience race conditions where multiple threads read the exact same uncommitted parent hash under PostgreSQL `READ COMMITTED` isolation. We serialized hash chain computation and entity persistence inside `AuditLogServiceImpl` using an explicit JVM `ReentrantLock` (`hashChainLock`). Tested with 25 concurrent threads, resulting in 100% sequential cryptographic continuity.

### 2. HikariCP Connection Pool Exhaustion Protection (LOG-03)
Volumetric bot attacks hitting unauthenticated endpoints previously generated synchronous database audit inserts, exhausting the 8-connection HikariCP pool. `AuditAuthenticationEntryPoint` enforces an in-memory sliding window rate limiter (`MAX_DB_AUDITS_PER_IP_PER_MINUTE = 5`). The first 5 requests per minute are written to PostgreSQL for forensic audit, while subsequent requests spill over to non-blocking Plane A local rolling files.

### 3. Asynchronous Clinical Decoupling (LOG-06)
Clinical consultations must never experience HTTP response latency spikes due to audit database writes. `ClinicalAuditAspect` intercepts `@ClinicalAudit` annotations and dispatches audit log persistence asynchronously via the `@Qualifier("virtualThreadExecutor") ExecutorService`, seamlessly forwarding MDC diagnostic context across thread boundaries.

### 4. PDPA/GDPR Cryptographic Pseudonym Pointer Pattern (LOG-08)
When a patient invokes their legal Right-to-Erasure, destroying audit records violates healthcare regulations, while keeping raw names violates privacy laws. Our architecture utilizes the **Pseudonymous Pointer Pattern**: reversible patient identity links are deleted and `AuthUser` records are anonymized, while audit records retain stable, non-reversible UUID pseudonym pointers. This guarantees 100% mathematical integrity of the SHA-256 hash chain without storing any identifiable PII.
