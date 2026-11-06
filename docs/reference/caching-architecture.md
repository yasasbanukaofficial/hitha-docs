---
id: caching-architecture
title: Multi-Tier Distributed Caching Strategy (Redis & In-Memory TTL)
sidebar_label: Caching Architecture & TTLs
slug: /reference/caching-architecture
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Multi-Tier Distributed Caching Strategy (Redis & In-Memory TTL)

To protect the primary PostgreSQL database from read-heavy dashboard spikes and doctor discovery scans, HITHA enforces a multi-tier caching architecture.

---

## ⚡ Cache Tiers & Invalidation Rules

<Tabs>
<TabItem value="sinhala" label="📖 සරල සිංහලෙන් (Plain Sinhala)" default>

- **Tier 1 (In-Memory JVM Cache)**: Admin Activity Dashboard එකේ count queries තත්පර 60ක් JVM memory එකේ cache කරලා තියාගන්නවා (`STATS_CACHE_TTL_MS = 60_000L`).
- **Tier 2 (Redis Distributed Cache)**: Doctor discovery list එක සහ doctor availability calendars විනාඩි 10ක TTL එකක් සහිතව Redis එකේ තියාගන්නවා (`availability:doc:{id}:{date}`).
- **Cache Eviction**: Doctor කෙනෙක් අලුත් slot එකක් add කළ විට හෝ appointment එකක් book වූ විට, ඒ අදාළ Redis key එක පමණක් ක්ෂණිකව delete වී (evict) අලුත් දත්ත පෙන්වයි.



</TabItem>
<TabItem value="english" label="💡 Technical Defense (English)">

- **Cache-Aside Pattern**: `DoctorAvailabilityService` checks Redis first; on a cache miss, reads from PostgreSQL, updates Redis with a 10-minute TTL, and returns the response.
- **Micro-Caching for Admin Dashboards**: Heavy operational aggregate counts are micro-cached in volatile memory holders with explicit invalidation endpoints (`invalidateStatsCache()`).



</TabItem>
</Tabs>
