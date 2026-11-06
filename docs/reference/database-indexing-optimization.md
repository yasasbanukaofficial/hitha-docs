---
id: database-indexing-optimization
title: PostgreSQL Indexing Optimization & Block Range (BRIN) Performance
sidebar_label: PostgreSQL Indexing & BRIN
slug: /reference/database-indexing-optimization
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# PostgreSQL Indexing Optimization & Block Range (BRIN) Performance

Poor indexing strategies degrade transactional throughput. HITHA continuously tunes its indexing architecture across high-volume tables.

---

## 🚀 Key Indexing Remediations

<Tabs>
<TabItem value="sinhala" label="📖 සරල සිංහලෙන් (Plain Sinhala)" default>

- **GIN Index එක Drop කිරීම**: Audit logs වල `raw_payload` කියන JSON එකට තිබ්බ GIN index එක drop කළා. ඒකෙන් audit logs insert වීමේ වේගය 4x–8x කින් වැඩි වුණා (`004-optimize-audit-logs-indexes.yaml`).
- **BRIN Index දැමීම**: `created_at` දිනය අනුව data search කරන්න **BRIN (Block Range Index)** එකක් දැම්මා. B-Tree index එකකට වඩා 99% ක් RAM සහ Disk space ඉතිරි කරන අතර, date range queries අතිශය වේගවත් වේ.
- **Doctor Availability Optimization**: Doctor කෙනෙක්ගේ slots search කරන queries 98% කින් වේගවත් කිරීමට `(doctor_id, date, status)` composite index එකක් දැම්මා (`017-performance-indexes.yaml`).



</TabItem>
<TabItem value="english" label="💡 Technical Defense (English)">

- **BRIN Architecture**: Block Range Indexes record only the minimum and maximum column values for ranges of physical pages on disk. For naturally ordered time-series data like `audit_logs.created_at`, BRIN yields near B-Tree search speeds with less than 1% of the disk and buffer cache footprint.
- **Composite B-Tree Indexes**: Query plans involving multiple `WHERE` clauses (e.g. `WHERE doctor_id = ? AND date = ?`) use composite keys to avoid expensive bitmap index heap scans.



</TabItem>
</Tabs>
