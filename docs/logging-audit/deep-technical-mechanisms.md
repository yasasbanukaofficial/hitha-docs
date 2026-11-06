---
id: deep-technical-mechanisms
title: Deep Technical Mechanisms & Q&A Defense
sidebar_label: Deep Mechanism Q&A
slug: /logging-audit/deep-technical-mechanisms
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Deep Technical Mechanisms & Q&A Defense

This section provides senior-level architectural answers to tough technical questions regarding concurrency, database indexing, connection pool safety, and regulatory compliance.

---

### 1. How does Hitha eliminate cryptographic hash-chain concurrency forks during high-throughput Virtual Thread bursts?

<Tabs>
<TabItem value="sinhala" label="📖 සරල සිංහලෙන් (Plain Sinhala)" default>

- **ගැටලුව (The Problem)**: Java 21 Virtual Threads 20ක් එකම මිලි තත්පරයේ audit records ලියන්න හදනකොට, Database එකේ කලින් record එක commit වෙලා නැති නිසා, මේ thread 20ම එකම "Previous Hash" එක කියවා ගන්නවා. එතකොට records 20ම එකම parent එකට link වෙලා chain එක දෙබල වෙනවා (fork වෙනවා). පස්සේ verify කරද්දී chain එක කැඩිලා පෙන්නනවා.
- **විසඳුම (The Fix)**: `AuditLogServiceImpl` එක ඇතුළේ `ReentrantLock` එකක් දැම්මා. Previous hash එක හොයන තැන ඉඳන්, අලුත් hash එක calculate කරලා, DB එකට save කරලා ඉවර වෙනකම් එක thread එකකට විතරයි ඇතුල් වෙන්න දෙන්නේ. අනික් 19 දෙනා පිළිවෙලට පෝලිමේ ඉන්නවා.
- **ඔප්පු කිරීම (Verification)**: `AuditLogServiceConcurrencyTest` එකෙන් Virtual Threads 20ක් එකවර දුවලා බැලුවා. Records 20ම එක දිගට 100% පරිපූර්ණ SHA-256 chain එකක් ලෙස ලියවුණා (`0dcb3b6`).



</TabItem>
<TabItem value="english" label="💡 Technical Defense (English)">

- **Root Cause**: In `AuditLogServiceImpl`, concurrent Java 21 Virtual Threads reading the latest parent hash simultaneously via `findLatestHashChainValue()` under PostgreSQL `READ COMMITTED` isolation read the exact same uncommitted parent, resulting in parallel hash branches and breaking verification.
- **Architectural Solution**: We serialized hash calculation and insertion using an explicit JVM `ReentrantLock` (`hashChainLock`) wrapping the parent lookup, `computeHashV2()`, and repository save.
- **Verification**: Verified with `AuditLogServiceConcurrencyTest` executing 20 simultaneous Virtual Threads writing audit logs concurrently. All 20 entries form a 100% sequential chain with zero broken links (`0dcb3b6`).



</TabItem>
</Tabs>

---

### 2. How does the Dual-Plane Logging Model protect the HikariCP connection pool against 401 unauthenticated DoS floods?

<Tabs>
<TabItem value="sinhala" label="📖 සරල සිංහලෙන් (Plain Sinhala)" default>

- **ගැටලුව (The Problem)**: Hacker කෙනෙක් හෝ bot කෙනෙක් තත්පරේකට වැරදි token දාලා requests 200ක් එවුවොත්, ඒ හැම 401 Unauthorized request එකකටම backend එකෙන් Database එකට audit log එකක් ලියන්න හැදුවා. Hitha එකේ Database එකට තියෙන්නේ connections 8යි (HikariCP pool size = 8). තත්පර 2කින් connections 8ම හිරවෙලා සාමාන්‍ය ලෙඩ්ඩුන්ට appointment දාගන්න බැරිව මුළු server එකම crash වෙනවා.
- **විසඳුම (The Fix)**: `AuditAuthenticationEntryPoint` එක ඇතුළට Sliding Window Rate Limiter එකක් දැම්මා. එක IP එකකින් විනාඩියකට DB එකට ලියන්න දෙන්නේ requests 5ක් විතරයි. 5 පැන්න ගමන් අනික් 195ම Database එකට යවන්නේ නැතුව Server එකේ local log file එකට විසි කරනවා.
- **ඔප්පු කිරීම (Verification)**: `AuditAuthenticationEntryPointTest` එකෙන් එකම IP එකෙන් requests 50ක් එවලා බැලුවා. හරියටම 5ක් DB එකට ගියා; ඉතිරි 45 local log file එකට ගියා. DB connection pool එක සම්පූර්ණයෙන්ම ආරක්ෂා වුණා (`be9630d`).



</TabItem>
<TabItem value="english" label="💡 Technical Defense (English)">

- **Root Cause**: Malicious crawlers or expired client apps hitting unauthenticated endpoints at 200+ requests/sec cause synchronous `audit_logs` inserts, quickly consuming all 8 HikariCP connections and crashing the backend.
- **Architectural Solution**: `AuditAuthenticationEntryPoint` enforces an in-memory sliding window rate limiter (`MAX_DB_AUDITS_PER_IP_PER_MINUTE = 5`).
- **Plane Split**: Legitimate 401 security denials (≤ 5/min/IP) are written to PostgreSQL (Plane B) for forensic auditing. Excess volumetric floods (> 5/min/IP) are routed exclusively to non-blocking local rolling files (Plane A `log.warn`) without touching database connections.
- **Verification**: Verified with `AuditAuthenticationEntryPointTest` simulating 50 rapid requests from the same IP: exactly 5 write to the DB, and 45 divert to Plane A logs (`be9630d`).



</TabItem>
</Tabs>

---

### 3. Why did we drop the GIN index on `raw_payload` and how do we prevent Admin Dashboard COUNT(*) query spikes?

<Tabs>
<TabItem value="sinhala" label="📖 සරල සිංහලෙන් (Plain Sinhala)" default>

- **ගැටලුව (The Problem)**: `raw_payload` කියන JSON තීරුවට කලින් GIN index එකක් දාලා තිබ්බා. GIN index එකෙන් කරන්නේ JSON එක ඇතුළේ තියෙන හැම වචනයක්ම වෙන වෙනම index කරන එක. මේ නිසා අලුතින් audit log එකක් දාන හැම වෙලාවකම DB එක 4x–8x ගුණයකින් slow වුණා. ඒ මදිවට Admin Dashboard එක open කරන හැම වතාවකම මුළු table එකම scan කරලා `COUNT(*)` 6ක් සහ DISTINCT queries 2ක් run වෙලා CPU එක 100% ගියා.
- **විසඳුම (The Fix)**:
  1. වැඩකට නැති GIN index එක drop කළා. ඒ වෙනුවට දිනය අනුව ඉතා වේගයෙන් search කරන 99% ක් කුඩා **BRIN index** එකක් දැම්මා (`004-optimize-audit-logs-indexes.yaml`).
  2. Dashboard එකේ count queries වල උත්තරය තත්පර 60ක් RAM එකේ cache කරලා තියාගත්තා (TTL Cache). ඊළඟ තත්පර 60 ඇතුළත කවුරු dashboard ආවත් DB එකට query යන්නේ නැහැ, RAM එකෙන් sub-millisecond උත්තරය දෙනවා.
- **ඔප්පු කිරීම (Verification)**: `AdminActivityLogServiceTest` එකෙන් පරීක්ෂා කළා. තත්පර 60ක් ඇතුළත කීප වතාවක් dashboard බැලුවත් DB එකට ගියේ එකම එක count query එකයි (`a1194c7`).



</TabItem>
<TabItem value="english" label="💡 Technical Defense (English)">

- **Root Cause**: The `idx_audit_payload` GIN index deconstructed every JSON audit payload on every `INSERT`, increasing write latency by 4x–8x and tripling disk storage, while rarely being queried in production. Additionally, opening the Admin Activity Dashboard triggered 6 full-table `COUNT(*)` queries.
- **Architectural Solution**:
  1. Executed Liquibase changeset `004-optimize-audit-logs-indexes.yaml` dropping `idx_audit_payload` and adding `idx_audit_created_action` (composite B-Tree) and `idx_audit_created_brin` (Block Range Index on `created_at`).
  2. Implemented a 60-second in-memory TTL cache (`STATS_CACHE_TTL_MS = 60_000L`) in `AdminActivityLogServiceImpl` for dashboard statistics and filter options, backed by volatile cached holders and an `invalidateStatsCache()` refresh hook.
- **Verification**: Verified with `AdminActivityLogServiceTest` confirming zero database count scans during repeated dashboard hits within the 60s TTL window (`a1194c7`).



</TabItem>
</Tabs>

---

### 4. How does the Cold-Storage Audit Archiver guarantee cryptographic immutability and zero-egress retention in Cloudflare R2?

<Tabs>
<TabItem value="sinhala" label="📖 සරල සිංහලෙන් (Plain Sinhala)" default>

- **ගැටලුව (The Problem)**: නීතිය අනුව මානසික සෞඛ්‍ය සහ මුදල් ගනුදෙනු logs අවුරුදු 7ක් තියාගන්න ඕනේ. හැබැයි මේ ඔක්කොම PostgreSQL Database එකේ අවුරුදු 7ක් තිබ්බොත්, DB එක GB 100 ගණන් ලොකු වෙලා, backup ගන්න බැරිව, queries slow වෙනවා.
- **විසඳුම (The Fix)**: `AuditLogArchiveServiceImpl` එක හැදුවා. දවස් 90 පරණ වුණු logs ටික stream එකක් විදියට අරන්, එක පේළියට එක JSON එක බැගින් ලියවෙන JSON Lines (JSONL) විදියට ලියලා, ලියවෙන ගමන්ම GZIP වලින් 88% කින් zip කරලා `.jsonl.gz` file එකක් හදනවා. ඒ මුළු file එකෙන්ම SHA-256 Checksum මුද්‍රාවක් (Manifest) හදනවා. ඊටපස්සේ ඒක **Cloudflare R2** එකට WORM (Write Once, Read Many) lock එකෙන් දාලා, DB එකේ ඒ partition එක 10ms වලින් drop කරලා DB space එක free කරනවා.
- **ඔප්පු කිරීම (Verification)**: `AuditLogArchiveServiceTest` එකෙන් compress කරපු file එකක් decompress කරලා බැලුවා. කිසිම දත්තයක් නැති නොවී මුල් audit records සේරම නිවැරදිව ලැබුණා (`45cc888`).



</TabItem>
<TabItem value="english" label="💡 Technical Defense (English)">

- **Root Cause**: Keeping historical audit logs (> 90 days) in active PostgreSQL inflates backup sizes and query memory.
- **Architectural Solution**: Built `AuditLogArchiveServiceImpl` with `buildColdArchiveBundle(jurisdiction, from, to)`. It streams records chronologically into GZIP-compressed JSON Lines (`.jsonl.gz`), calculates a SHA-256 digest of the archive file, and binds first/last hash chain values into an immutable bundle metadata manifest under Hive-partitioned object keys (`audit-archive/jurisdiction=LK/year=YYYY/month=MM/audit_logs_...`).
- **Verification**: Verified with `AuditLogArchiveServiceTest` validating GZIP decompression, SHA-256 manifest integrity, and lossless record reconstruction (`45cc888`).



</TabItem>
</Tabs>
