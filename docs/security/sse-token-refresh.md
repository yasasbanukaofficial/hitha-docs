---
id: sse-token-refresh
title: Server-Sent Events (SSE) & Seamless Token Refresh Lifecycle
sidebar_label: SSE & JWT Renewal Handshake
slug: /security/sse-token-refresh
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Server-Sent Events (SSE) & Seamless Token Refresh Lifecycle

Real-time notifications in HITHA (appointment bookings, payment confirmations, doctor call rings) are delivered using persistent Server-Sent Events (SSE) over HTTP streaming.

---

## 🔄 The Token Expiration Handshake

<Tabs>
<TabItem value="sinhala" label="📖 සරල සිංහලෙන් (Plain Sinhala)" default>

- **ගැටලුව**: SSE connection එකක් කියන්නේ server එක සහ browser එක අතර දිගටම ඇරලා තියෙන persistent line එකක්. User ගේ JWT access token එක විනාඩි 15කින් expire වෙනවා. කලින් token එක expire වුණු ගමන් SSE line එක කැඩිලා user ට notification එන එක නැවතුණා.
- **විසඳුම**: Backend එකෙන් token එක expire වෙන්න විනාඩියකට කලින් SSE line එක හරහා `TOKEN_REFRESH_REQUIRED` කියලා silent signal එකක් browser එකට යවනවා. Browser එක background එකේ refresh token එක යවලා අලුත් access token එකක් අරන්, පරණ SSE line එක කඩන්නේ නැතිවම token එක renew කරගන්නවා.
- **ප්‍රතිඵලය**: Doctor හෝ Patient පැය ගණන් dashboard එකේ හිටියත් කවදාවත් connection කැඩෙන්නේ නැත.



</TabItem>
<TabItem value="english" label="💡 Technical Defense (English)">

- **Mechanism**: The backend runs an SSE heartbeat loop. When an active connection's JWT token approaches expiration, the server emits a structured `TOKEN_EXPIRED_WARNING` event over the established stream.
- **Client Handshake**: The frontend intercepts this event, triggers a background refresh request to `/api/v1/auth/refresh-token`, receives a fresh token, and acknowledges the active connection without re-establishing TCP handshakes.
- **Failure Resilience**: If token renewal fails, the connection terminates gracefully with an explicit redirect to the re-authentication page rather than hanging in a dead socket state.



</TabItem>
</Tabs>
