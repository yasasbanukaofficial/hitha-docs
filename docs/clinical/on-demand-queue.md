---
id: on-demand-queue
title: On-Demand Emergency Queue & Doctor Dispatch Engine
sidebar_label: On-Demand Queue & Dispatch
slug: /clinical/on-demand-queue
---


# On-Demand Emergency Queue & Doctor Dispatch Engine

Patients in crisis require immediate psychiatric or psychological attention without booking days in advance. HITHA's **On-Demand Dispatch Engine** pairs patients with active on-duty doctors within seconds.

<div className="arch-diagram-wrapper">
  <img src="/img/diagrams/on-demand-queue-dispatch.svg" alt="On-Demand Emergency Queue &amp; Doctor Dispatch Engine" width="100%" />
  <div className="arch-diagram-caption">
    <span><b>Figure 5.0:</b> Pessimistic Row Lock Doctor Dispatch &amp; Acceptance Window</span>
    <span className="arch-diagram-badge">RTC-02 &amp; QUEUE</span>
  </div>
</div>

---

## ⚡ Dispatch Architecture

- **Queue Polling & Dispatch**: `WaitingQueueDispatcherScheduler` runs periodically, querying unassigned queue entries. Available doctors are selected using round-robin distribution with pessimistic row-locking on the doctor pool table.
- **State Machine Transitions**: Transitions from `QUEUED` ➔ `RINGING` (with a 45-second acceptance countdown) ➔ `ACCEPTED` / `TRANSFERRED_TO_NEXT_DOCTOR` on timeout.
