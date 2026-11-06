# HITHA Documentation & Diagram System QA Checklist

This document audits all 19 technical documentation pages in the HITHA developer portal against the **Golden Diagram Standard (`DIAGRAM_STANDARD.md`)**, **Rule 1 (Real-Life Scenarios, NOT Class Names)**, **Rule 2 (Spacing & Layout)**, **Rule 3 (Content Spacing)**, **Rule 4 (Search UI/UX)**, and **Rule 5 (Automated Verification)**.

---

## 📋 Comprehensive Page Audit Matrix

| # | Page Route | Document Title | Flow Diagram ID | Scenario Plain-English Story | Node Count | Steps / Play Flow | No Class Names | Mobile TB Responsive |
|:---|:---|:---|:---|:---|:---:|:---:|:---:|:---:|
| 1 | `/docs/` | Overview & Core Principles | `heroNodes` | Patient and Doctor connecting through HITHA Distributed Healthcare Topology | 6 | Yes (6 steps) | Pass | Pass (<640px) |
| 2 | `/docs/logging-audit/dual-plane-architecture` | Dual-Plane Logging Architecture | `dualPlaneHeroNodes` + LOG-01 to LOG-05 | 6 Diagrams: Request tagging, Logback async, Lock concurrency, 401 shield, BRIN cache, Cold R2 | ≤ 5 each | Yes (multi-step) | Pass | Pass (<640px) |
| 3 | `/docs/logging-audit/deep-technical-mechanisms` | Deep Mechanism Q&A | `heroNodes` | Handling patient requests across operational and legal compliance tiers | 6 | Yes (6 steps) | Pass | Pass (<640px) |
| 4 | `/docs/logging-audit/task-roadmap-and-progress` | Task Roadmap & Progress | `log05Nodes` | Old audit records move to cold storage and an auditor verifies them later | 4 | Yes | Pass | Pass (<640px) |
| 5 | `/docs/clinical/livekit-webrtc` | Server Integration (LiveKit) | `livekitIntegrationNodes` | Establishing a real-time WebRTC audio/video consultation | 4 | Yes (4 steps) | Pass | Pass (<640px) |
| 6 | `/docs/clinical/on-demand-queue` | Emergency Queue & Dispatch | `onDemandNodes` | An emergency patient requests an instant doctor consultation | 5 | Yes (4 steps) | Pass | Pass (<640px) |
| 7 | `/docs/clinical/prescriptions-catalog` | Prescriptions & Drug Catalog | `prescriptionsCatalogNodes` | Issuing a digital prescription with zero sensitive health data in logs | 5 | Yes | Pass | Pass (<640px) |
| 8 | `/docs/security/rate-limiting` | Distributed Rate Limiting | `rateLimitingNodes` | Three kinds of visitors hit the API | 5 | Yes (4 steps) | Pass | Pass (<640px) |
| 9 | `/docs/security/rbac-superadmin` | RBAC & Governance | `rbacNodes` | Enforcing role hierarchy and pseudonymous user identity | 5 | Yes | Pass | Pass (<640px) |
| 10 | `/docs/security/sse-token-refresh` | SSE & Token Refresh | `sseRefreshNodes` | Maintaining live updates and refreshing tokens without dropouts | 4 | Yes | Pass | Pass (<640px) |
| 11 | `/docs/financial/payhere-webhook-idempotency` | PayHere Webhook Idempotency | `paymentFlowNodes` | A patient pays for a consultation | 5 | Yes (4 steps) | Pass | Pass (<640px) |
| 12 | `/docs/financial/doctor-wallet-escrow` | Doctor Wallet & Escrow | `escrowNodes` | Holding consultation fees in escrow until doctor sign-off | 5 | Yes (4 steps) | Pass | Pass (<640px) |
| 13 | `/docs/financial/subscription-plans-durations` | Subscriptions & Plans | `subscriptionPlansNodes` | Validating plan entitlements and extending in-call durations | 5 | Yes | Pass | Pass (<640px) |
| 14 | `/docs/reference/transactional-outbox-pattern` | Transactional Outbox | `outboxNodes` | Guaranteeing notification delivery without database locking | 5 | Yes (4 steps) | Pass | Pass (<640px) |
| 15 | `/docs/reference/caching-architecture` | Caching Architecture | `cachingNodes` | Answering high-frequency queries from cache to protect database | 4 | Yes | Pass | Pass (<640px) |
| 16 | `/docs/reference/database-indexing-optimization` | Database Indexing & BRIN | `indexingNodes` | Searching 10 million audit records in under 5 milliseconds | 4 | Yes | Pass | Pass (<640px) |
| 17 | `/docs/reference/background-schedulers` | Background Schedulers | `schedulersNodes` | Running automated maintenance tasks across clustered nodes | 5 | Yes | Pass | Pass (<640px) |
| 18 | `/docs/reference/technical-terms-dictionary` | Architecture Terms Dictionary | `heroNodes` | Distributed terminology execution lifecycle across all system tiers | 6 | Yes (6 steps) | Pass | Pass (<640px) |
| 19 | `/docs/engineering-timeline/daily-timeline` | Daily Engineering Timeline | `TimelineInteractiveFlow` | Step-by-step verification of engineering deliverables merged on Nov 06, 2026 | 5 | Yes (4 steps) | Pass | Pass (<640px) |

---

## 🛡️ Rule Compliance Summary

1. **Rule 1 (Real-Life Stories, Zero Class Names)**:
   - All node titles and captions describe real-world actors (`Patient App`, `Doctor Portal`, `Spring Boot Gate`, `PostgreSQL 16`, `Redis 7.2 Cluster`, `LiveKit SFU`, `Cloudflare R2`).
   - Zero Java/Spring framework class names (`*Impl`, `*Service`, `*Controller`, `*Filter`, `*Repository`, `*Entrypoint`, `\w+\(\)`) appear in titles, captions, or edge labels. Class names are strictly encapsulated in the technical details side drawer.
   - Every diagram features a high-contrast scenario bar (`Scenario: ...`) at the top.

2. **Rule 2 (Spacing & Canvas Controls)**:
   - Clear horizontal separation ≥ 220px achieved via Dagre `ranksep: 260` (nodesep: 130). No edge label collisions.
   - React Flow `<Controls />` panel completely purged from DOM across all diagrams.
   - Clean top-right header controls: `▶ Play flow` and `↺ Reset`.
   - Responsive auto-layout: Automatic `LR` to `TB` conversion via `ResizeObserver` when viewport < 640px.

3. **Rule 3 (Content Spacing)**:
   - Article body typography standardized with `line-height: 1.7` and `margin-bottom: 1.25rem`.
   - Max content container width constrained to 760–780px.
   - 32px vertical margins around diagrams and 24px spacing above captions.

4. **Rule 4 (Search UI/UX)**:
   - Global hotkey support: `Ctrl+K`, `Cmd+K`, and `/`.
   - High-contrast category filter chips with active background indicators.
   - Touch targets ≥ 44px with keyboard navigation (`ArrowUp`, `ArrowDown`, `Enter`, `Escape`).
   - Matches highlighted with bold `<mark>` elements.

5. **Rule 5 (Automated Verification)**:
   - Enforced via `scripts/check-diagrams.mjs`.
   - Verified 19 / 19 pages passing AST and regex lint checks with 0 errors.
