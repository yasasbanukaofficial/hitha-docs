---
id: transactional-outbox-pattern
title: Transactional Outbox Pattern & Notification Resilience
sidebar_label: Transactional Outbox
slug: /reference/transactional-outbox-pattern
---

import BrowserOnly from '@docusaurus/BrowserOnly';
import FlowDiagram from '@site/src/components/FlowDiagram';
import { outboxNodes, outboxEdges, outboxSteps } from '@site/src/components/FlowDiagram/diagramData';

# Transactional Outbox Pattern & Notification Resilience

In a distributed telehealth platform, database state changes (e.g. confirming a patient booking) must never desynchronize from third-party side effects (e.g. sending SMS confirmations via TextLK or email receipts via SMTP).

<BrowserOnly fallback={<div style={{ height: '400px', background: '#f8fbff', borderRadius: '16px' }} />}>
  {() => (
    <FlowDiagram
      nodes={outboxNodes}
      edges={outboxEdges}
      steps={outboxSteps}
      height={400}
      scenario="Scenario: Guaranteeing notification delivery without database locking"
      caption="Transactional Outbox Pattern: Spring Boot mutates entity + outbox_events in 1 ACID transaction, polled by ShedLock workers with DLQ quarantine."
      direction="LR"
    />
  )}
</BrowserOnly>

---

## 1. The Dual-Write Problem

Directly invoking external APIs inside a database `@Transactional` boundary causes critical vulnerabilities:
1. If the database transaction rolls back after an SMS was already sent, the patient receives confirmation for an aborted booking.
2. If the external SMS gateway experiences latency or timeouts, the database connection is held hostage, starving HikariCP connection pools.

---

## 2. Outbox Implementation

HITHA persists both the business entity and an `outbox_events` record within the **exact same database transaction**:

```java
@Transactional
public Booking confirmBooking(UUID bookingId) {
    Booking booking = bookingRepository.findByIdForUpdate(bookingId);
    booking.setStatus(BookingStatus.CONFIRMED);
    bookingRepository.save(booking);

    OutboxEvent event = new OutboxEvent();
    event.setAggregateType("BOOKING");
    event.setAggregateId(booking.getId().toString());
    event.setEventType("BOOKING_CONFIRMED");
    event.setPayload(objectMapper.writeValueAsString(new BookingConfirmedPayload(booking)));
    event.setStatus(OutboxStatus.PENDING);
    outboxRepository.save(event);

    return booking;
}
```

A dedicated background dispatcher (`OutboxPublisherScheduler`) polls pending events with exponential backoff and dead-letter queue (DLQ) support.
