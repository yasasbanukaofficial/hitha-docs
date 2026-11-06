---
id: sse-token-refresh
title: Server-Sent Events (SSE) & Seamless Token Refresh Lifecycle
sidebar_label: SSE & Token Refresh
slug: /security/sse-token-refresh
---

import BrowserOnly from '@docusaurus/BrowserOnly';
import FlowDiagram from '@site/src/components/FlowDiagram';
import { sseRefreshNodes, sseRefreshEdges } from '@site/src/components/FlowDiagram/diagramData';

# Server-Sent Events (SSE) & Seamless Token Refresh Lifecycle

Real-time clinical updates (doctor ringing alerts, in-call extension requests, wallet balance transfers) are pushed to clients using persistent HTTP Server-Sent Events (SSE).

<BrowserOnly fallback={<div style={{ height: '380px', background: '#f8fbff', borderRadius: '16px' }} />}>
  {() => (
    <FlowDiagram
      nodes={sseRefreshNodes}
      edges={sseRefreshEdges}
      height={380}
      caption="Server-Sent Events & Token Refresh: Persistent HTTP stream with 30s heartbeats and background JWT auto-refresh extending sliding 15-minute access TTL."
      direction="LR"
    />
  )}
</BrowserOnly>

---

## 1. SSE Connection Lifecycle

```bash
# Patient establishing real-time event stream
curl -N -H "Accept: text/event-stream" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  https://api.hitha.lk/api/v1/notifications/stream
```

1. **Handshake**: The client connects with a short-lived JWT access token (15-minute expiration).
2. **Heartbeat Keep-Alive**: The backend emits `:ping\n\n` comments every 15 seconds to prevent intermediate proxy gateways from terminating the connection.
3. **Seamless Token Refresh**: When the 15-minute access token approaches expiration, the client triggers a background refresh call (`POST /api/v1/auth/refresh-token`) exchanging the HTTP-only secure refresh cookie for a new JWT without disconnecting the active SSE stream.
