---
id: rate-limiting
title: Distributed Multi-Tier Rate Limiting & Throttling
sidebar_label: Distributed Rate Limiting
slug: /security/rate-limiting
---

# Distributed Multi-Tier Rate Limiting & Throttling

To shield HITHA's Spring Boot backend from brute-force authentication attacks, scrapers, and denial-of-service attempts, our API gateway implements a 3-tier distributed token bucket rate limiter powered by Bucket4j and Redis.

<div className="dyte-diagram-container">
  <img src="/img/diagrams/rate-limiting-tiers.svg" alt="Distributed Multi-Tier Rate Limiting Architecture" width="100%" />
</div>

All requests carry standard rate-limiting HTTP headers (`X-RateLimit-Remaining`, `X-RateLimit-Retry-After-Seconds`) and reject quota violations with `HTTP 429 Too Many Requests`.

---

## 1. Rate Limiting Policy Tiers

```yaml
security:
  rate-limiting:
    tiers:
      auth-endpoints:
        capacity: 5
        refill-tokens: 5
        refill-duration: 1m
        endpoints:
          - "/api/v1/auth/login"
          - "/api/v1/auth/verify-otp"
          - "/api/v1/auth/forgot-password"
      clinical-public:
        capacity: 60
        refill-tokens: 60
        refill-duration: 1m
        endpoints:
          - "/api/v1/doctors"
          - "/api/v1/slots/available"
      authenticated-doctor:
        capacity: 300
        refill-tokens: 300
        refill-duration: 1m
        endpoints:
          - "/api/v1/clinical/**"
          - "/api/v1/doctor/wallet/**"
```

---

## 2. Preventing Connection Pool Exhaustion

Failed authentication attempts return `HTTP 401 Unauthorized` without opening a database transaction:
- **Zero HikariCP Pool Degradation**: Authentication failure events are tracked in-memory using a sliding-window counter. If an IP exceeds 5 consecutive 401s in 60 seconds, it is throttled at the filter level before consuming HikariCP database connections.
