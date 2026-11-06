---
id: livekit-webrtc
title: Telehealth Video Engine (LiveKit WebRTC & In-Call Diagnostics)
sidebar_label: LiveKit Telehealth & WebRTC
slug: /clinical/livekit-webrtc
---


# Telehealth Video Engine (LiveKit WebRTC & In-Call Diagnostics)

HITHA uses **LiveKit SFU (Selective Forwarding Unit)** for ultra-low latency, HIPAA-compliant encrypted video and audio consultation sessions between patients and doctors.

<div className="arch-diagram-wrapper">
  <img src="/img/diagrams/livekit-webrtc.svg" alt="LiveKit WebRTC SFU Architecture" width="100%" />
  <div className="arch-diagram-caption">
    <span><b>Figure 3.0:</b> LiveKit SFU Video Room Lifecycle &amp; Mid-Call Quota Settlement</span>
    <span className="arch-diagram-badge">RTC-01 &amp; CALL-EXT</span>
  </div>
</div>

---

## 🎥 Video Consultation Lifecycle

- **Room Provisioning**: Rooms are dynamically spun up on LiveKit via `LiveKitRoomService` with encrypted token authorization and room timeouts matched to booked session durations (15m, 30m, 45m).
- **In-Call Signaling**: In-call extensions emit room events over LiveKit data packets and SSE channels. When an extension is confirmed, `DoctorOnDemandService` deducts session credits and dispatches state updates without tearing down the active media stream.
