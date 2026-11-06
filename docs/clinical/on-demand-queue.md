---
id: on-demand-queue
title: On-Demand Emergency Queue & Doctor Dispatch Engine
sidebar_label: On-Demand Queue & Dispatch
slug: /clinical/on-demand-queue
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# On-Demand Emergency Queue & Doctor Dispatch Engine

Patients in crisis require immediate psychiatric or psychological attention without booking days in advance. HITHA's **On-Demand Dispatch Engine** pairs patients with active on-duty doctors within seconds.

---

## ⚡ Dispatch Architecture

<Tabs>
<TabItem value="sinhala" label="📖 සරල සිංහලෙන් (Plain Sinhala)" default>

- **Duty Doctors**: Doctors ලා තමන්ගේ app එකෙන් "Go On-Duty" toggle එක on කළ විට ඔවුන් Redis presence pool එකට එකතු වෙනවා.
- **Queue Dispatcher**: Patient කෙනෙක් "Call Now" click කළ විට request එක `on_demand_queue` table එකට යනවා. Background scheduler එකෙන් available duty doctor කෙනෙක්ව **Pessimistic Lock (`SELECT FOR UPDATE`)** දාලා අහුලාගෙන, doctor ගේ phone එකට real-time push එකක් යවනවා.
- **Race Condition Immunity**: Doctor ලා දෙන්නෙක්ට එකම patient යන්නේ නැත; එක doctor කෙනෙක්ට එකවර patient ලා දෙන්නෙක් යන්නේද නැත.



</TabItem>
<TabItem value="english" label="💡 Technical Defense (English)">

- **Queue Polling & Dispatch**: `WaitingQueueDispatcherScheduler` runs periodically, querying unassigned queue entries. Available doctors are selected using round-robin distribution with pessimistic row-locking on the doctor pool table.
- **State Machine Transitions**: Transitions from `QUEUED` ➔ `RINGING` (with a 45-second acceptance countdown) ➔ `ACCEPTED` / `TRANSFERRED_TO_NEXT_DOCTOR` on timeout.



</TabItem>
</Tabs>
