---
id: database-indexing-optimization
title: PostgreSQL Indexing Optimization & Block Range (BRIN) Performance
sidebar_label: PostgreSQL Indexing & BRIN
slug: /reference/database-indexing-optimization
---


# PostgreSQL Indexing Optimization & Block Range (BRIN) Performance

Poor indexing strategies degrade transactional throughput. HITHA continuously tunes its indexing architecture across high-volume tables.

---

## 🚀 Key Indexing Remediations

- **BRIN Architecture**: Block Range Indexes record only the minimum and maximum column values for ranges of physical pages on disk. For naturally ordered time-series data like `audit_logs.created_at`, BRIN yields near B-Tree search speeds with less than 1% of the disk and buffer cache footprint.
- **Composite B-Tree Indexes**: Query plans involving multiple `WHERE` clauses (e.g. `WHERE doctor_id = ? AND date = ?`) use composite keys to avoid expensive bitmap index heap scans.
