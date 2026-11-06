---
id: sse-token-refresh
title: Server-Sent Events (SSE) & Seamless Token Refresh Lifecycle
sidebar_label: SSE & JWT Renewal Handshake
slug: /security/sse-token-refresh
---


# Server-Sent Events (SSE) & Seamless Token Refresh Lifecycle

Real-time notifications in HITHA (appointment bookings, payment confirmations, doctor call rings) are delivered using persistent Server-Sent Events (SSE) over HTTP streaming.

---

## 🔄 The Token Expiration Handshake

- **Mechanism**: The backend runs an SSE heartbeat loop. When an active connection's JWT token approaches expiration, the server emits a structured `TOKEN_EXPIRED_WARNING` event over the established stream.
- **Client Handshake**: The frontend intercepts this event, triggers a background refresh request to `/api/v1/auth/refresh-token`, receives a fresh token, and acknowledges the active connection without re-establishing TCP handshakes.
- **Failure Resilience**: If token renewal fails, the connection terminates gracefully with an explicit redirect to the re-authentication page rather than hanging in a dead socket state.
