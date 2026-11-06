---
id: background-schedulers
title: Background Schedulers & Distributed Job Orchestration
sidebar_label: Background Schedulers
slug: /reference/background-schedulers
---

# Background Schedulers & Distributed Job Orchestration

Background tasks in HITHA are orchestrated using ShedLock and Spring's `@Scheduled` annotation to guarantee single-instance execution across multi-pod Kubernetes deployments.

---

## 1. Master Scheduler Catalog

| Scheduler Name | Cron / Interval | Purpose | Lock Key |
|:---|:---|:---|:---|
| `ReservationExpiryScheduler` | Every 5 minutes (`0 */5 * * * *`) | Releases abandoned `HOLD` slots back to `AVAILABLE` | `lock:reservation:expiry` |
| `WaitingQueueDispatcherScheduler` | Every 5 seconds (`*/5 * * * * *`) | Assigns ringing doctors to emergency on-demand patients | `lock:queue:dispatcher` |
| `DailyAuditArchiveScheduler` | Daily at 02:00 AM (`0 0 2 * * *`) | Compresses >90d audit logs and exports to Cloudflare R2 | `lock:audit:archival` |
| `DoctorPayoutReconciliationScheduler` | Sundays at midnight | Reconciles completed escrow transactions with bank batches | `lock:doctor:payout` |
