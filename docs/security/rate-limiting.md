---
id: rate-limiting
title: Enterprise Multi-Tier Distributed Rate Limiting & Throttling
sidebar_label: Distributed Rate Limiting
slug: /security/rate-limiting
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Enterprise Multi-Tier Distributed Rate Limiting & Throttling

HITHA operates in a multi-tenant healthcare environment where automated bots, malicious actors, or misconfigured mobile apps can flood endpoints, exhaust the database connection pool, and cause clinical outages.

To guarantee zero clinical impact, HITHA implements a 4-tier distributed rate-limiting architecture powered by **Bucket4j**, **Redis Token Buckets**, and **Spring AOP**.

---

## 🛡️ Multi-Tier Architecture Overview

<Tabs>
<TabItem value="sinhala" label="📖 සරල සිංහලෙන් (Plain Sinhala)" default>

### Rate Limiting කියන්නේ මොකක්ද?

කවුරුහරි හෝ bot කෙනෙක් අපේ server එකට එක දිගට request එවලා server එක crash කරන එක (DoS Attack) වළක්වන්න අපි පියවර 4ක ආරක්ෂක වළල්ලක් (Tiers) හදලා තියෙනවා:

1. **Tier 1 (Edge Protection)**: Login, OTP, Register endpoints වලට එක IP එකකින් එන්න පුළුවන් ප්‍රමාණය සීමා කරලා තියෙන්නේ (Brute force attacks වැලැක්වීමට).
2. **Tier 2 (Sensitive Financial Endpoints)**: PayHere Payment Webhooks වැනි endpoints වලට නියමිත rate limit එකක් දීලා තියෙනවා duplicate payments වැලැක්වීමට.
3. **Tier 3 (User / Role Bandwidth)**: Doctor, Patient, Super Admin අනුව ඔවුන්ට API එක භාවිතා කළ හැකි වේග සීමාවන් (Token Buckets) Redis එකෙන් පාලනය කරනවා.
4. **Tier 4 (Clinical Emergency Fail-Open)**: Live video call එකක් හෝ emergency consultation එකක් අතරතුර කිසිම වෙලාවක Rate Limit එකක් වැදිලා call එක 끊ෙන්නේ නැති වෙන්න, Clinical endpoints වලට **Fail-Open Safe Rule** එකක් දාලා තියෙනවා (Redis crash වුණත් clinical calls බාධාවකින් තොරව සිදුවේ).



</TabItem>
<TabItem value="english" label="💡 Plain English (No Jargon)">

### The Tiered Token-Bucket Protection

Rate limiting ensures fair usage and prevents attackers from exhausting system resources:

- **Edge Layer**: Protects public authentication endpoints from credential stuffing and automated OTP SMS exhaustion attacks.
- **Financial Layer**: Guards payment gateways against webhook floods and replay attacks.
- **Application Layer**: Uses `@RateLimited` annotations on service methods to dynamically throttle abusive clients.
- **Clinical Exception**: Emergency telehealth video calls and clinical note saving bypass strict limits through a fail-open circuit to prioritize patient safety.



</TabItem>
<TabItem value="technical" label="⚙️ Deep Architecture & Code">

```
Incoming HTTP Request
   │
   ▼
[Phase 2: Edge IP Rate Limiter] (Filter level, Bucket4j + Redis)
   │ ──► Exceeded? ──► Return HTTP 429 Too Many Requests + Retry-After
   │
   ▼
[Security / JWT Authentication]
   │
   ▼
[Phase 4: Method-Level @RateLimited Aspect] (Spring AOP)
   │ ──► Evaluates Role, Endpoint Tier, and User Token Bucket
   │
   ▼
[Controller & Domain Execution]
```

### Rate Limiting Tiers

| Tier | Target Scope | Algorithm | Backing Store | Behavior on Limit |
|:---|:---|:---|:---|:---|
| **Tier 1: Auth & OTP** | Public IP | Token Bucket (5 req/min) | Redis In-Memory | HTTP 429 + Cooldown |
| **Tier 2: PayHere Webhook** | Merchant IP | Sliding Window (10 req/sec) | Redis CAS | HTTP 429 |
| **Tier 3: User Bandwidth** | Authenticated User | Token Bucket (60 req/min) | Redis | HTTP 429 |
| **Tier 4: Clinical Consultation** | Active Session | Concurrency Semaphore | Local JVM | **Fail-Open** (Never drops live consultation) |


</TabItem>
</Tabs>
