---
id: livekit-webrtc
title: Telehealth Video Engine (LiveKit WebRTC & In-Call Diagnostics)
sidebar_label: LiveKit Telehealth & WebRTC
slug: /clinical/livekit-webrtc
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Telehealth Video Engine (LiveKit WebRTC & In-Call Diagnostics)

HITHA uses **LiveKit SFU (Selective Forwarding Unit)** for ultra-low latency, HIPAA-compliant encrypted video and audio consultation sessions between patients and doctors.

---

## 🎥 Video Consultation Lifecycle

<Tabs>
<TabItem value="sinhala" label="📖 සරල සිංහලෙන් (Plain Sinhala)" default>

- **කොහොමද call එකක් පටන් ගන්නේ?**: Patient කෙනෙක් appointment එක book කරපු ගමන් backend එකෙන් LiveKit server එකේ secure room එකක් හදනවා.
- **Tokens**: Doctor ට සහ Patient ට වෙන වෙනම cryptographically signed JWT video tokens දෙනවා.
- **Mid-Call Extension (CALL-EXT-02 to 04)**: Call එක ඉවර වෙන්න විනාඩි 3ක් තියෙද්දී Doctor ට තව විනාඩි 15ක් හෝ 30ක් දිගු කරන්න (Extend) පුළුවන්. Patient එක approve කරපු ගමන් real-time signal එකකින් room duration එක වැඩි වෙලා, patient ගේ subscription quota එකෙන් credits auto-settle වෙනවා (`5caa7f5`).



</TabItem>
<TabItem value="english" label="💡 Technical Defense (English)">

- **Room Provisioning**: Rooms are dynamically spun up on LiveKit via `LiveKitRoomService` with encrypted token authorization and room timeouts matched to booked session durations (15m, 30m, 45m).
- **In-Call Signaling**: In-call extensions emit room events over LiveKit data packets and SSE channels. When an extension is confirmed, `DoctorOnDemandService` deducts session credits and dispatches state updates without tearing down the active media stream.



</TabItem>
</Tabs>
