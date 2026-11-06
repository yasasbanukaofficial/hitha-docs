---
id: caching-architecture
title: Multi-Tier Distributed Caching Strategy (Redis & In-Memory TTL)
sidebar_label: Caching Architecture
slug: /reference/caching-architecture
---

# Multi-Tier Distributed Caching Strategy (Redis & In-Memory TTL)

To protect PostgreSQL 16 from high-frequency queries and maintain sub-50ms API responses, HITHA implements a multi-tier caching hierarchy:

---

## 1. Cache Tier Allocations

| Cache Key | Storage Medium | TTL | Invalidation Trigger |
|:---|:---|:---|:---|
| `doctor:presence:{id}` | Redis String | 60 seconds | Doctor toggles "Go Off-Duty" |
| `doctor:slots:{id}:{date}` | Redis Hash | 5 minutes | Slot booked or cancelled |
| `admin:dashboard:stats` | In-Memory `Caffeine` | 60 seconds | Auto-expires on timer |
| `security:rate-limit:{ip}` | Redis Bucket4j | 60 seconds | Sliding token window |

---

## 2. Stampede Prevention (Mutex Locking)

When cached statistics expire, multiple concurrent threads could overwhelm the database with expensive aggregation queries. HITHA prevents this using distributed mutex locking (`Redisson` or `SETNX`):

```java
public DashboardStats getDashboardStats() {
    String cached = redisTemplate.opsForValue().get("admin:stats");
    if (cached != null) return deserialize(cached);
    
    // Acquire distributed lock so only ONE thread queries DB
    RLock lock = redissonClient.getLock("lock:admin:stats");
    if (lock.tryLock(5, TimeUnit.SECONDS)) {
        try {
            DashboardStats fresh = auditRepository.computeAggregates();
            redisTemplate.opsForValue().set("admin:stats", serialize(fresh), 60, TimeUnit.SECONDS);
            return fresh;
        } finally {
            lock.unlock();
        }
    }
    return getFallbackStaleStats();
}
```
