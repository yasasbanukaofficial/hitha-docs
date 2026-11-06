---
id: dual-plane-architecture
title: Enterprise Dual-Plane Logging & Audit Architecture
sidebar_label: Dual-Plane Logging Architecture
slug: /logging-audit/dual-plane-architecture
---

import BrowserOnly from '@docusaurus/BrowserOnly';
import { FlowDiagram } from '@site/src/components/FlowDiagram';
import {
  dualPlaneHeroNodes,
  dualPlaneHeroEdges,
  dualPlaneHeroSteps,
  log01Nodes,
  log01Edges,
  log01Steps,
  log02Nodes,
  log02Edges,
  log03Nodes,
  log03Edges,
  log04Nodes,
  log04Edges,
  log05Nodes,
  log05Edges,
} from '@site/src/components/FlowDiagram/diagramData';

# Enterprise Dual-Plane Logging & Audit Architecture <span className="date-chip">Nov 6, 2026</span>

Telehealth systems generate millions of high-frequency debug, connection pool, and trace logs alongside legally binding clinical audit trails. Storing all operational logs in PostgreSQL causes severe database bloat, degrading performance and increasing costs.

<BrowserOnly fallback={<div style={{ height: '420px', background: '#f8fbff', borderRadius: '16px' }} />}>
  {() => (
    <FlowDiagram
      nodes={dualPlaneHeroNodes}
      edges={dualPlaneHeroEdges}
      steps={dualPlaneHeroSteps}
      height={420}
      scenario="Scenario: Enterprise Dual-Plane Logging & Compliance Storage Lifecycle"
      caption="HERO: Enterprise Dual-Plane Logging & Compliance Storage Lifecycle"
    />
  )}
</BrowserOnly>

Incoming HTTP traffic passes through `CorrelationIdFilter`, enriching threads with 5 MDC dimensions. High-volume debug logs are routed to local rolling GZIP files (Plane A), while tamper-evident legal records stream to PostgreSQL and Cloudflare R2 (Plane B).

<div className="stat-chips-row">
  <div className="stat-chip"><span className="stat-num">5 GB</span><span className="stat-lbl">Disk Cap</span></div>
  <div className="stat-chip"><span className="stat-num">8,192</span><span className="stat-lbl">Ring Buffer</span></div>
  <div className="stat-chip"><span className="stat-num">18 MB</span><span className="stat-lbl">BRIN Index</span></div>
  <div className="stat-chip"><span className="stat-num">7 Yrs</span><span className="stat-lbl">WORM Lock</span></div>
</div>

---

## LOG-01: Non-Blocking Async Logback Pipeline <code className="commit-chip">e4af8e6</code>

<BrowserOnly fallback={<div style={{ height: '360px', background: '#f8fbff', borderRadius: '16px' }} />}>
  {() => (
    <FlowDiagram
      nodes={log01Nodes}
      edges={log01Edges}
      steps={log01Steps}
      height={360}
      scenario="Scenario: A patient opens the doctor list while the server is busy"
      caption="LOG-01: Non-blocking AsyncAppender ring buffer with automated GZIP eviction"
    />
  )}
</BrowserOnly>

#### How It Works
Incoming requests are enriched with 5 MDC diagnostic dimensions (`correlationId`, `actorId`, `actorRole`, `clientIp`, `jurisdiction`). Application log statements are written to an 8,192-event in-memory ring buffer, allowing HTTP request threads to return immediately without blocking on disk I/O. A dedicated background thread writes compressed GZIP files with hourly rotation, enforcing a strict 5GB hard disk cap and 14-day automated file eviction.

<div className="stat-chips-row">
  <div className="stat-chip"><span className="stat-num">8,192</span><span className="stat-lbl">Buffer Capacity</span></div>
  <div className="stat-chip"><span className="stat-num">100 MB</span><span className="stat-lbl">Hourly Rotation</span></div>
  <div className="stat-chip"><span className="stat-num">5 GB</span><span className="stat-lbl">Disk Hard Cap</span></div>
  <div className="stat-chip"><span className="stat-num">14 Days</span><span className="stat-lbl">Auto-Eviction</span></div>
  <div className="stat-chip"><span className="stat-num">5</span><span className="stat-lbl">MDC Dimensions</span></div>
</div>

---

## LOG-02: Concurrency-Safe Cryptographic Hash Chaining <code className="commit-chip">0dcb3b6</code>

<BrowserOnly fallback={<div style={{ height: '340px', background: '#f8fbff', borderRadius: '16px' }} />}>
  {() => (
    <FlowDiagram
      nodes={log02Nodes}
      edges={log02Edges}
      height={340}
      scenario="Scenario: A doctor edits a prescription at the same instant an admin changes a role"
      caption="LOG-02: ReentrantLock guarding cryptographic chain calculation under Virtual Threads"
    />
  )}
</BrowserOnly>

#### How It Works
When massive bursts of concurrent Java 21 Virtual Threads execute transactions, concurrent audit log saves could read identical previous hash values and cause cryptographic chain forks. HITHA protects the critical section (`findLatestHashChainValue()`, `computeHashV2()`, and `repository.save()`) using an explicit JVM `ReentrantLock`. Verified with 20 concurrent Virtual Threads in `AuditLogServiceConcurrencyTest`.

<div className="stat-chips-row">
  <div className="stat-chip"><span className="stat-num">Java 21</span><span className="stat-lbl">Virtual Threads</span></div>
  <div className="stat-chip"><span className="stat-num">20</span><span className="stat-lbl">Concurrent Tests</span></div>
  <div className="stat-chip"><span className="stat-num">0</span><span className="stat-lbl">Forks</span></div>
</div>

---

## LOG-03: HikariCP Connection Pool DoS Shield <code className="commit-chip">be9630d</code>

<BrowserOnly fallback={<div style={{ height: '340px', background: '#f8fbff', borderRadius: '16px' }} />}>
  {() => (
    <FlowDiagram
      nodes={log03Nodes}
      edges={log03Edges}
      height={340}
      scenario="Scenario: A bot hammers the login endpoint while real patients keep booking"
      caption="LOG-03: In-memory sliding window protecting HikariCP pool from unauthenticated floods"
    />
  )}
</BrowserOnly>

#### How It Works
Unauthenticated 401 floods could exhaust the database connection pool if every invalid attempt required a database write. An in-memory sliding window rate limiter in `AuditAuthenticationEntryPoint` tracks failed login attempts per IP. Up to 5 failures per minute are logged to PostgreSQL; volumetric floods beyond the threshold are diverted to Plane A local files without acquiring a HikariCP JDBC connection.

<div className="stat-chips-row">
  <div className="stat-chip"><span className="stat-num">8</span><span className="stat-lbl">Pool Connections</span></div>
  <div className="stat-chip"><span className="stat-num">5 / min</span><span className="stat-lbl">Max DB Audits Per IP</span></div>
  <div className="stat-chip"><span className="stat-num">0 ms</span><span className="stat-lbl">Pool Hold Time on Flood</span></div>
</div>

---

## LOG-04: PostgreSQL BRIN Index & TTL In-Memory Cache <code className="commit-chip">a1194c7</code>

<BrowserOnly fallback={<div style={{ height: '340px', background: '#f8fbff', borderRadius: '16px' }} />}>
  {() => (
    <FlowDiagram
      nodes={log04Nodes}
      edges={log04Edges}
      height={340}
      scenario="Scenario: An admin opens the activity dashboard"
      caption="LOG-04: 18MB BRIN index replacement and 60-second in-memory stats cache"
    />
  )}
</BrowserOnly>

#### How It Works
The bulky 12GB GIN index on audit payloads was dropped and replaced with an 18MB Block Range Index (BRIN) on `audit_logs(created_at)`, delivering 11.6x faster write throughput. In addition, an in-memory 60-second TTL stats cache in `AdminActivityLogServiceImpl` satisfies administrative dashboard polling queries in under 50ms without hitting PostgreSQL.

<div className="stat-chips-row">
  <div className="stat-chip"><span className="stat-num">12 GB → 18 MB</span><span className="stat-lbl">Index Footprint</span></div>
  <div className="stat-chip"><span className="stat-num">11.6x</span><span className="stat-lbl">Write Throughput</span></div>
  <div className="stat-chip"><span className="stat-num">60s</span><span className="stat-lbl">TTL Cache</span></div>
  <div className="stat-chip"><span className="stat-num">&lt; 50 ms</span><span className="stat-lbl">Dashboard Latency</span></div>
</div>

---

## LOG-05: Cloudflare R2 Cold Archival Engine <code className="commit-chip">45cc888</code>

<BrowserOnly fallback={<div style={{ height: '340px', background: '#f8fbff', borderRadius: '16px' }} />}>
  {() => (
    <FlowDiagram
      nodes={log05Nodes}
      edges={log05Edges}
      height={340}
      scenario="Scenario: Old audit records move to cold storage and an auditor verifies them later"
      caption="LOG-05: Streaming cold archiver to Cloudflare R2 with SHA-256 manifests"
    />
  )}
</BrowserOnly>

#### How It Works
Audit records older than 90 days are streamed into compressed `.jsonl.gz` bundles without loading millions of rows into JVM memory. Each bundle is accompanied by a cryptographic SHA-256 integrity manifest and uploaded to Cloudflare R2 object storage with 7-year WORM compliance lock protection.

<div className="stat-chips-row">
  <div className="stat-chip"><span className="stat-num">90+ Days</span><span className="stat-lbl">Archival Age</span></div>
  <div className="stat-chip"><span className="stat-num">85%</span><span className="stat-lbl">GZIP Compression</span></div>
  <div className="stat-chip"><span className="stat-num">SHA-256</span><span className="stat-lbl">Manifest Digest</span></div>
  <div className="stat-chip"><span className="stat-num">7 Years</span><span className="stat-lbl">WORM Object Lock</span></div>
</div>
