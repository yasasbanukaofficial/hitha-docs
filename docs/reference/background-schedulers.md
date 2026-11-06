---
id: background-schedulers
title: Background Schedulers & Distributed Job Orchestration
sidebar_label: Background Schedulers
slug: /reference/background-schedulers
---

import BrowserOnly from '@docusaurus/BrowserOnly';
import FlowDiagram from '@site/src/components/FlowDiagram';
import { schedulersNodes, schedulersEdges } from '@site/src/components/FlowDiagram/diagramData';

# Background Schedulers & Distributed Job Orchestration

Background tasks in HITHA are orchestrated using ShedLock and Spring's `@Scheduled` annotation with Java 21 Virtual Threads to guarantee single-instance execution across multi-pod deployments.

<BrowserOnly fallback={<div style={{ height: '380px', background: '#f8fbff', borderRadius: '16px' }} />}>
  {() => (
    <FlowDiagram
      nodes={schedulersNodes}
      edges={schedulersEdges}
      height={380}
      caption="Distributed Job Orchestration: Leader node acquires ShedLock mutex before spawning non-blocking virtual threads for LOG-05 archival and queue dispatching."
      direction="LR"
    />
  )}
</BrowserOnly>

---

## 1. Master Scheduler Catalog

| Scheduler Name | Cron / Interval | Purpose | Lock Key |
|:---|:---|:---|:---|
| `ReservationExpiryScheduler` | Every 5 minutes (`0 */5 * * * *`) | Releases abandoned `HOLD` slots back to `AVAILABLE` | `lock:reservation:expiry` |
| `WaitingQueueDispatcherScheduler` | Every 5 seconds (`*/5 * * * * *`) | Assigns ringing doctors to emergency on-demand patients | `lock:queue:dispatcher` |
| `DailyAuditArchiveScheduler` | Daily at 02:00 AM (`0 0 2 * * *`) | Compresses >90d audit logs and exports to Cloudflare R2 | `lock:audit:archival` |
| `DoctorPayoutReconciliationScheduler` | Sundays at midnight | Reconciles completed escrow transactions with bank batches | `lock:doctor:payout` |
