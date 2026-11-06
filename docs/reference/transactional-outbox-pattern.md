---
id: transactional-outbox-pattern
title: Transactional Outbox Pattern & Notification Resilience
sidebar_label: Transactional Outbox & DLQ
slug: /reference/transactional-outbox-pattern
---


# Transactional Outbox Pattern & Notification Resilience

Network failures must never cause SMS, Email, or push notifications to be lost when bookings or payments succeed.

---

## 📬 The Outbox Execution Flow

- **Atomic State Transitions**: Domain state changes (e.g. `bookings`) and notification intents are persisted within the exact same database transaction, eliminating dual-write failure modes.
- **Poller & Exponential Backoff**: A scheduled poller locks unconsumed outbox events, dispatches to third-party providers (Notify.lk, SES), and implements exponential backoff before sending unrecoverable failures to the Dead Letter Queue.
