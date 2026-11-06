---
id: daily-timeline
title: Engineering Daily Timeline & Work Accomplished
sidebar_label: Daily Engineering Timeline
slug: /engineering-timeline/daily-timeline
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Engineering Daily Timeline & Work Accomplished

This timeline records all engineering changes, security remediations, performance optimizations, and features delivered to the Hitha codebase.

---

### **Today (November 06, 2026): Enterprise Dual-Plane Logging & Audit Architecture Delivery**
- **LOG-01 (`e4af8e6`)**: Deployed `logback-spring.xml` with non-blocking `AsyncAppender` (8,192 event ring buffer), hourly/100MB GZIP rolling policy, 5GB hard disk cap, and 14-day auto-eviction. Enriched `CorrelationIdFilter.java` with 5 MDC dimensions (`correlationId`, `actorId`, `actorRole`, `clientIp`, `jurisdiction`).
- **LOG-02 (`0dcb3b6`)**: Eliminated hash-chain concurrency race conditions under Java 21 Virtual Thread bursts by wrapping `findLatestHashChainValue()`, `computeHashV2()`, and repository save in an explicit JVM `ReentrantLock` in `AuditLogServiceImpl.java`. Verified with 20 concurrent Virtual Threads in `AuditLogServiceConcurrencyTest`.
- **LOG-03 (`be9630d`)**: Protected the 8-connection HikariCP database pool against 401 unauthenticated DoS floods by adding an in-memory sliding window rate limiter in `AuditAuthenticationEntryPoint.java` (`MAX_DB_AUDITS_PER_IP_PER_MINUTE = 5`), routing volumetric floods to Plane A local logs. Verified with `AuditAuthenticationEntryPointTest`.
- **LOG-04 (`a1194c7`)**: Dropped unused `idx_audit_payload` GIN index via Liquibase migration `004-optimize-audit-logs-indexes.yaml`. Added `idx_audit_created_brin` (Block Range Index) and `idx_audit_created_action` (Composite). Implemented a 60-second in-memory TTL stats cache in `AdminActivityLogServiceImpl.java`.
- **LOG-05 (`45cc888`)**: Implemented cold-storage audit archiver `AuditLogArchiveServiceImpl.java` streaming historical audit records into `.jsonl.gz` archives with companion SHA-256 manifests for Cloudflare R2 object storage. Verified with `AuditLogArchiveServiceTest`.

---

### **November 04, 2026: Mid-Call Consultation Extension & Multi-Session Delivery**
- **CALL-EXT-01 (`d5492c6`)**: Allowed multi-session initial duration selection (15m, 30m, 45m) on on-demand Call Now initiation.
- **BUG-QUOTA-01 (`db3bb1f`)**: Resolved PostgreSQL read-only transaction conflict on subscription eligibility check.
- **CALL-EXT-02 to 04 (`5caa7f5`)**: Delivered mid-call duration extensions, real-time signaling over LiveKit/SSE, and multi-credit settlement from subscription quotas.
- **SCALAR API (`daf8d71`)**: Synchronized Scalar OpenAPI reference documentation for mid-call extension and rate-limiting endpoints.

---

### **November 03, 2026: Multi-Tier Distributed Rate Limiting (RL-01 to RL-09)**
- **RL-01 & RL-02 (`c31dc38`)**: Implemented Phase 2 Edge IP Filter and migrated authentication/phone SMS cooldowns to distributed Bucket4j token buckets.
- **RL-04 & RL-07 (`226b657`)**: Implemented `@RateLimited` annotation and Spring AOP aspect with tiered endpoint bandwidth protection.
- **RL-06 (`a94fa44`)**: Enforced Tier 2 rate limit on PayHere payment webhooks.
- **RL-08 & RL-09 (`fb940b9`)**: Enforced clinical concurrency limits (RL-08) and Micrometer DDoS telemetry counters (RL-09).
