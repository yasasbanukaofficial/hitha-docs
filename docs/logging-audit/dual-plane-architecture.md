---
id: dual-plane-architecture
title: Enterprise Dual-Plane Logging & Storage Architecture
sidebar_label: Dual-Plane Logging Architecture
slug: /logging-audit/dual-plane-architecture
---

import BrowserOnly from '@docusaurus/BrowserOnly';
import DualPlaneFlow from '@site/src/components/DualPlaneFlow';

# Enterprise Dual-Plane Logging & Storage Architecture

Telehealth systems generate millions of high-frequency debug, connection pool, and trace logs alongside legally binding clinical audit trails. Storing all operational logs in PostgreSQL causes severe database bloat, degrading performance and increasing costs.

<BrowserOnly fallback={<div style={{ height: '330px', background: '#f8fbff', borderRadius: '16px' }} />}>
  {() => <DualPlaneFlow />}
</BrowserOnly>

HITHA resolves this by enforcing a strict **Dual-Plane Separation Architecture** separating transient operational logs from immutable compliance logs.

---

## 1. Plane Comparison

| Metric / Attribute | Plane A: Operational Debug Logs | Plane B: Clinical & Compliance Audit Logs |
|:---|:---|:---|
| **Destination** | Local Ephemeral Container Disk (`/logs`) | PostgreSQL Database (`audit_logs`) + Cloudflare R2 |
| **Ingestion Engine** | Logback `RollingFileAppender` | `AuditLogServiceImpl` with Hash Chain verification |
| **Throughput Target** | 10,000+ events / second | 500-1,000 verified legal events / second |
| **Storage Cap & Eviction** | **5GB disk cap** or **14 days** max history | **90-Day Hot DB retention** ➔ **7-Year Cold R2 WORM** |
| **Searchability** | Grep, FluentBit, Vector, Datadog | PostgreSQL BRIN index & REST Audit Dashboard |
| **Tamper Resistance** | Standard filesystem permissions | Cryptographic SHA-256 Hash Chain verification |

---

## 2. Ingestion & Correlation Tracing

Every incoming HTTP request passes through `CorrelationIdFilter`, assigning a unique tracking UUID:

```java
@Component
public class CorrelationIdFilter extends OncePerRequestFilter {
    public static final String CORRELATION_HEADER = "X-Correlation-Id";
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        String correlationId = request.getHeader(CORRELATION_HEADER);
        if (correlationId == null || correlationId.isBlank()) {
            correlationId = UUID.randomUUID().toString();
        }
        MDC.put("correlationId", correlationId);
        response.setHeader(CORRELATION_HEADER, correlationId);
        try {
            filterChain.doFilter(request, response);
        } finally {
            MDC.remove("correlationId");
        }
    }
}
```
