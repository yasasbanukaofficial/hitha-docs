---
id: on-demand-queue
title: Emergency Doctor Dispatch & On-Demand Queue
sidebar_label: Emergency Queue & Dispatch
slug: /clinical/on-demand-queue
---

import BrowserOnly from '@docusaurus/BrowserOnly';
import FlowDiagram from '@site/src/components/FlowDiagram';
import { onDemandNodes, onDemandEdges, onDemandSteps } from '@site/src/components/FlowDiagram/diagramData';

# Emergency Doctor Dispatch & On-Demand Queue

Patients in crisis require immediate psychiatric or psychological attention without booking days in advance. HITHA's **On-Demand Dispatch Engine** pairs patients with active on-duty doctors within seconds.

<BrowserOnly fallback={<div style={{ height: '420px', background: '#f8fbff', borderRadius: '16px' }} />}>
  {() => (
    <FlowDiagram
      nodes={onDemandNodes}
      edges={onDemandEdges}
      steps={onDemandSteps}
      height={420}
      scenario="Scenario: An emergency patient requests an instant doctor consultation"
      caption="Figure 5.0: Pessimistic Row Lock Doctor Dispatch & Acceptance Window (45s Timer)"
      direction="LR"
    />
  )}
</BrowserOnly>

It all starts with a patient initiating an emergency consultation call from the mobile application. The dispatch scheduler evaluates doctor duty pools in Redis and applies database row-level locking to guarantee zero race conditions.

---

## 1. On-Demand Call Request

When a patient taps **Call Now**, the mobile app dispatches an on-demand booking request to the backend.

```bash
curl --request POST \
  --url https://api.hitha.lk/api/v1/on-demand/call-now \
  --header 'Authorization: Bearer <PATIENT_JWT_TOKEN>' \
  --header 'Content-Type: application/json' \
  --data '{
    "category": "PSYCHIATRY",
    "initialDuration": "DURATION_15M",
    "symptoms": ["ACUTE_ANXIETY", "PANIC_ATTACK"]
  }'
```

#### Response

```json
{
  "success": true,
  "data": {
    "queueId": "queue_req_78b209",
    "status": "RINGING",
    "assignedDoctorId": "doc_psych_401",
    "acceptanceWindowSeconds": 45,
    "timeoutAt": "2026-11-06T11:45:00.000Z"
  }
}
```

---

## 2. Pessimistic Row Lock & Doctor Assignment

The dispatch engine executes a lock over candidate on-duty doctors in PostgreSQL to prevent concurrent assignment conflicts:

```sql
SELECT d.id, d.full_name, d.status 
FROM doctors d
JOIN doctor_duty_pools p ON d.id = p.doctor_id
WHERE p.is_active = true 
  AND p.status = 'AVAILABLE'
  AND d.specialization = 'PSYCHIATRY'
ORDER BY p.last_assigned_at ASC
FOR UPDATE SKIP LOCKED
LIMIT 1;
```

---

## 3. Acceptance Window & Room Activation

- **45-Second Countdown**: The selected duty doctor receives a push notification and high-priority WebRTC ringing event via SSE.
- **Reroute on Timeout**: If the 45-second window expires without doctor acknowledgment, `WaitingQueueDispatcherScheduler` marks the attempt as missed and cascades to the next doctor in the pool without dropping the patient's queue priority.
- **LiveKit Handshake**: Upon acceptance, `DoctorOnDemandService` transitions the room to `ACTIVE` and returns live token credentials.
