---
id: caching-architecture
title: Multi-Tier Distributed Caching Strategy (Redis & In-Memory TTL)
sidebar_label: Caching Architecture & TTLs
slug: /reference/caching-architecture
---


# Multi-Tier Distributed Caching Strategy (Redis & In-Memory TTL)

To protect the primary PostgreSQL database from read-heavy dashboard spikes and doctor discovery scans, HITHA enforces a multi-tier caching architecture.

---

## ⚡ Cache Tiers & Invalidation Rules

- **Cache-Aside Pattern**: `DoctorAvailabilityService` checks Redis first; on a cache miss, reads from PostgreSQL, updates Redis with a 10-minute TTL, and returns the response.
- **Micro-Caching for Admin Dashboards**: Heavy operational aggregate counts are micro-cached in volatile memory holders with explicit invalidation endpoints (`invalidateStatsCache()`).
