---
id: background-schedulers
title: Background Schedulers & Distributed Job Orchestration
sidebar_label: Background Schedulers
slug: /reference/background-schedulers
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Background Schedulers & Distributed Job Orchestration

HITHA utilizes scheduled tasks to handle queue dispatching, consultation reminders, subscription quota cycle rollovers, and wallet reconciliation.

---

## ⏱️ Master Scheduler Inventory

| Scheduler Component | Frequency | Primary Responsibility | Concurrency Protection |
|:---|:---|:---|:---|
| `WaitingQueueDispatcherScheduler` | Every 5 Seconds | Pairs queued on-demand patients with available on-duty doctors | Pessimistic row locking on doctor presence pool |
| `ConsultationReminderScheduler` | Every 1 Minute | Dispatches 15m and 1h reminders for upcoming scheduled appointments | Idempotent lock keys in Redis (`reminder:lock:{id}`) |
| `OutboxEventDispatcherScheduler` | Every 2 Seconds | Reads and sends queued SMS/Email notifications | `SKIP LOCKED` batch fetching |
| `SubscriptionCycleRolloverScheduler` | Daily at Midnight | Evaluates active billing cycles and rolls over monthly quotas | Transactional cycle ledger |
| `PartitionMaintenanceScheduler` | Monthly at 00:00 | Creates next month's PostgreSQL partitions and drops cold archived ones | Sub-10ms detachment window |
