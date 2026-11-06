---
id: rate-limiting
title: Enterprise Multi-Tier Distributed Rate Limiting & Throttling
sidebar_label: Distributed Rate Limiting
slug: /security/rate-limiting
---


# Enterprise Multi-Tier Distributed Rate Limiting & Throttling

HITHA operates in a multi-tenant healthcare environment where automated bots, malicious actors, or misconfigured mobile apps can flood endpoints, exhaust the database connection pool, and cause clinical outages.

To guarantee zero clinical impact, HITHA implements a 4-tier distributed rate-limiting architecture powered by **Bucket4j**, **Redis Token Buckets**, and **Spring AOP**.

<div className="arch-diagram-wrapper">
  <img src="/img/diagrams/rate-limiting-tiers.svg" alt="HITHA Multi-Tier Rate Limiting Architecture" width="100%" />
  <div className="arch-diagram-caption">
    <span><b>Figure 2.0:</b> Pre-Auth Filter-Level Bucket4j Rate Limiting &amp; Fail-Open Circuit</span>
    <span className="arch-diagram-badge">SEC-01 &amp; SEC-03</span>
  </div>
</div>

---

## 🛡️ Multi-Tier Architecture Overview

### The Tiered Token-Bucket Protection

Rate limiting ensures fair usage and prevents attackers from exhausting system resources:

- **Edge Layer**: Protects public authentication endpoints from credential stuffing and automated OTP SMS exhaustion attacks.
- **Financial Layer**: Guards payment gateways against webhook floods and replay attacks.
- **Application Layer**: Uses `@RateLimited` annotations on service methods to dynamically throttle abusive clients.
- **Clinical Exception**: Emergency telehealth video calls and clinical note saving bypass strict limits through a fail-open circuit to prioritize patient safety.
