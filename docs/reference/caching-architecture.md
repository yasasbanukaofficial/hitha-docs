---
id: caching-architecture
title: Multi-Tier Distributed Caching Strategy (Redis & In-Memory TTL)
sidebar_label: Caching Architecture
slug: /reference/caching-architecture
---

import BrowserOnly from '@docusaurus/BrowserOnly';
import FlowDiagram from '@site/src/components/FlowDiagram';
import { cachingNodes, cachingEdges } from '@site/src/components/FlowDiagram/diagramData';

# Multi-Tier Distributed Caching Strategy (Redis & In-Memory TTL)

To protect PostgreSQL 16 from high-frequency queries and maintain sub-50ms API responses, HITHA implements a multi-tier caching hierarchy combining L1 JVM Caffeine memory with L2 Redis 7.2 distributed clusters.

<BrowserOnly fallback={<div style={{ height: '380px', background: '#f8fbff', borderRadius: '16px' }} />}>
  {() => (
    <FlowDiagram
      nodes={cachingNodes}
      edges={cachingEdges}
      height={380}
      scenario="Scenario: Answering high-frequency queries from cache to protect database"
      caption="Multi-Tier Caching Flow: L1 Caffeine micro-cache handles high-frequency reads in RAM; L2 Redis Cluster with Redisson mutex locking shields the primary PostgreSQL database."
      direction="LR"
    />
  )}
</BrowserOnly>

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
