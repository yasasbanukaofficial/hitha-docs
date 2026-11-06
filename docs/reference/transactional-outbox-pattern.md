---
id: transactional-outbox-pattern
title: Transactional Outbox Pattern & Notification Resilience
sidebar_label: Transactional Outbox & DLQ
slug: /reference/transactional-outbox-pattern
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Transactional Outbox Pattern & Notification Resilience

Network failures must never cause SMS, Email, or push notifications to be lost when bookings or payments succeed.

---

## 📬 The Outbox Execution Flow

<Tabs>
<TabItem value="sinhala" label="📖 සරල සිංහලෙන් (Plain Sinhala)" default>

- **ගැටලුව**: Booking එකක් save වුණාට පස්සේ SMS gateway එක down වෙලා තිබ්බොත්, patient ට SMS එක යන්නේ නැත. Backend එකේදිම කෙලින්ම SMS යවන්න හැදුවොත් network delay එක නිසා booking process එක slow වේ.
- **විසඳුම (Transactional Outbox)**: Booking එක save වෙන database transaction එක ඇතුළෙන්ම `outbox_events` table එකට record එකක් දමයි. Background worker කෙනෙක් මේ table එකෙන් events අරන් SMS/Email යවයි.
- **Dead Letter Queue (DLQ)**: 5 වතාවක් retry කරලත් යවන්න බැරි වුණොත්, notification එක `DEAD_LETTER_QUEUE` status එකට මාරු කර Super Admin ට alert එකක් දෙයි.



</TabItem>
<TabItem value="english" label="💡 Technical Defense (English)">

- **Atomic State Transitions**: Domain state changes (e.g. `bookings`) and notification intents are persisted within the exact same database transaction, eliminating dual-write failure modes.
- **Poller & Exponential Backoff**: A scheduled poller locks unconsumed outbox events, dispatches to third-party providers (Notify.lk, SES), and implements exponential backoff before sending unrecoverable failures to the Dead Letter Queue.



</TabItem>
</Tabs>
