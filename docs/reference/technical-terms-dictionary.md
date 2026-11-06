---
id: technical-terms-dictionary
title: Technical Terms & Architecture Glossary
sidebar_label: Architecture Terms Dictionary
slug: /reference/technical-terms-dictionary
---

import BrowserOnly from '@docusaurus/BrowserOnly';
import FlowDiagram from '@site/src/components/FlowDiagram';
import { heroNodes, heroEdges, heroSteps } from '@site/src/components/FlowDiagram/diagramData';

# Technical Terms & Architecture Glossary

This glossary defines core distributed systems, database, cryptographic, and telemetry terminology used across the HITHA engineering platform. Each concept includes an everyday engineering analogy, its conversational Sinhala explanation (සරල සිංහල තේරුම), its concrete operational definition, and its direct codebase touchpoint.

<BrowserOnly fallback={<div style={{ height: '400px', background: '#f8fbff', borderRadius: '16px' }} />}>
  {() => (
    <FlowDiagram
      nodes={heroNodes}
      edges={heroEdges}
      steps={heroSteps}
      height={400}
      scenario="Scenario: Distributed terminology execution lifecycle across all system tiers"
      caption="Figure 8.0: High-Level Architecture Topology Mapping Key Engineering Terminology"
      direction="LR"
    />
  )}
</BrowserOnly>

---

## 📚 Complete Dictionary of Architecture Terms (English & Conversational Sinhala)

| Technical Term | Plain English Analogy | සරල සිංහල තේරුම (Sinhala) | HITHA Codebase Location |
|:---|:---|:---|:---|
| **Dual-Plane Logging** | **Two-Road Traffic Separation**: Sending high-frequency debug traces to local files, while keeping only legally-binding audit records in the database. | ලොග් වර්ග දෙක වෙනම පාරවල් දෙකකට බෙදීම (Debug logs local file වලට, Legal logs DB එකට) | `logback-spring.xml` + `AuditLogServiceImpl.java` |
| **Log Rolling Policy** | **File Size & Time Auto-Chunking**: Closing the current log file and starting a fresh one whenever 100MB or 1 hour is reached, compressing the old one into `.gz`. | ෆයිල් එක ලොකු වෙනකොට පැයෙන් පැයට හෝ 100MB වලින් zip කර අලුත් file එකක් පටන් ගැනීම | `logback-spring.xml` (`SizeAndTimeBasedRollingPolicy`) |
| **Disk Cap / Auto-Eviction** | **Automatic Storage Safety Valve**: Enforcing a maximum disk limit (5GB) and age (14 days), deleting the oldest files automatically when the limit is breached. | ඉඩ පිරෙන්න නොදී 5GB පිරුණු සැනින් හෝ දින 14ක් පැරණි වූ සැනින් පරණ logs ඉබේ delete වීම | `totalSizeCap=5GB` & `maxHistory=14` in `logback-spring.xml` |
| **MDC (Mapped Diagnostic Context)** | **Thread Context Tagging**: Attaching metadata (user ID, client IP, correlation ID) to the execution thread so every log statement prints those details automatically. | Request එකක් ආ විට Correlation ID සහ IP එක thread එකට ලේබල් කර logs වල ඉබේ print වීම | `CorrelationIdFilter.java` injecting MDC context |
| **Correlation ID** | **Unique Request Tracking Number**: A single UUID passed across all logs, microservices, and response headers to trace one user action from start to finish. | Request එකකට දෙන සුවිශේෂී ට්‍රැකින් අංකය (Error එකක් ආ විට එක ID එකෙන් සේරම logs සොයාගැනීම) | `CorrelationIdFilter.java` (`X-Correlation-Id`) |
| **Virtual Threads (Java 21)** | **Ultra-Lightweight Concurrency**: JVM-managed lightweight threads consuming only a few bytes of memory, allowing 100,000+ simultaneous operations without thread starvation. | Java 21 හි ඇති සුපිරි සැහැල්ලු ත්‍රෙඩ් (ලක්ෂ ගණනක් users ලාට එකවර සේවය දිය හැක) | `spring.threads.virtual.enabled=true` |
| **Hash-Chain Race Condition** | **Sequence Collision Under Load**: When concurrent threads read the same uncommitted parent hash before any transaction finishes, causing parallel branches and breaking cryptographic integrity. | සමගාමී threads දෙකක් එකම parent hash එක කියවීම නිසා දාමය දෙබල වී ගණනය කැඩී යාම | Fixed in `AuditLogServiceImpl.java` using `ReentrantLock` |
| **ReentrantLock** | **Explicit Thread Turn-Taker**: A Java concurrency lock ensuring only one thread can execute a critical code block at any given millisecond. | කවුරු ආවත් එක වෙලාවකදී එක thread එකකට පමණක් run වීමට ඉඩ දී පෝලිමේ තබන Java අගුල | `AuditLogServiceImpl.hashChainLock` |
| **HikariCP Connection Pool** | **Database Connection Vault**: A fixed set of 8 pre-opened, reusable database connections shared across all incoming user requests. | Backend එක සහ PostgreSQL අතර ඇති සීමිත (කලින් සාදා ඇති) සම්බන්ධතා 8 | `maximum-pool-size=8` in `application.yml` |
| **Connection Pool Exhaustion** | **Database Line Congestion**: A crash where all 8 database connections are occupied by slow queries or bot floods, causing all other requests to fail with HTTP 500. | Database මාර්ග 8ම හිරවීම නිසා සර්වර් එක හිරවී 500 error දී crash වීම | Prevented in LOG-03 via `AuditAuthenticationEntryPoint` |
| **Sliding Window Rate Limiter** | **Moving 60-Second Quota Bouncer**: An algorithm that tracks request timestamps over the last 60 seconds to ensure a client never exceeds an allowed burst threshold. | ගෙවුණු තත්පර 60 ඇතුළත එකම IP එකකින් ආ requests ගණන බලා සීමාව (5) පැන්න විට block කිරීම | `AuditAuthenticationEntryPoint.java` |
| **GIN Index** | **Heavy Multi-Key Search Index**: A PostgreSQL index that deconstructs every word inside a JSONB column; excellent for deep text searching but heavily penalizes write speed (4x-8x slower). | JSON එකක් ඇතුළේ ඇති හැම අකුරක්ම index කරන බරැති index එකක් (අලුතින් ලියන විට DB එක slow කරයි) | Dropped from `audit_logs.raw_payload` in LOG-04 |
| **BRIN Index (Block Range Index)** | **Ultra-Compact Range Index**: An index storing only the minimum and maximum values for blocks of disk pages, taking 99% less disk space than B-Trees. | පිටු මිටි වල අවම සහ උපරිම දිනය පමණක් ලකුණු කර තබා ගන්නා 99%ක් කුඩා වේගවත් index එක | Added on `audit_logs(created_at)` in LOG-04 |
| **Composite B-Tree Index** | **Multi-Column Fast-Lane**: An index combining two columns together (`created_at DESC, action`) so sorting and filtering bypass full-table scans. | දිනය සහ action එක එකතු කර හදන වේගවත් සෙවුම් පාර (table scan වීම වළක්වයි) | Added on `audit_logs (created_at DESC, action)` in LOG-04 |
| **TTL Cache (Time-To-Live)** | **Temporary In-Memory Snapshot**: Storing heavy query results (like dashboard counters) in application RAM for 60 seconds to serve repeat visits instantly without hitting the database. | Dashboard count queries වල උත්තරය තත්පර 60ක් RAM එකේ තබාගෙන DB එකට නොගොස් දීම | `AdminActivityLogServiceImpl.java` (`STATS_CACHE_TTL_MS`) |
| **JSON Lines (JSONL)** | **One-Record-Per-Line Format**: A streaming text format where each line is an independent JSON object, avoiding out-of-memory errors on large datasets. | එක පේළියට එක JSON එක බැගින් ලියන format එක (GB ගණන් logs වුවත් memory පිරෙන්නේ නැත) | `AuditLogArchiveServiceImpl.java` |
| **GZIP Stream Compression** | **On-the-Fly Byte Shrinker**: Compressing data directly as it is being written into a byte stream, reducing size by 85%-90% without temporary disk files. | Data ලියවෙන මොහොතේදීම zip කර (85% කින් කුඩා කර) memory එක ඉතිරි කිරීම | `GZIPOutputStream` in `AuditLogArchiveServiceImpl.java` |
| **SHA-256 Manifest** | **Cryptographic Tamper-Proof Seal**: A companion metadata digest recording the exact cryptographic checksum of an exported archive to prove it was never tampered with. | Archive කළ zip file එකේ content එකෙන් හදන 64-character ඩිජිටල් මුද්‍රාව | `AuditArchiveBundle.getArchiveSha256()` |
| **WORM Storage** | **Write Once, Read Many Cloud Vault**: Cloud object storage locked so that uploaded files cannot be modified, deleted, or overwritten by anyone for 7 years. | වරක් දැමූ පසු Super Admin ටවත් අවුරුදු 7ක් යනතුරු මකා දැමිය නොහැකි ආරක්ෂිත cloud ගබඩාව | Cloudflare R2 Object Storage with Object Lock |
| **Hive Partitioning** | **Folder-By-Time Hierarchy**: Organizing cloud files into directory paths like `year=YYYY/month=MM/jurisdiction=LK/` so external tools only scan relevant folders. | Cloud bucket එකේ ගොඩගසන්නේ නැතිව අවුරුද්ද සහ මාසය අනුව folder වලට බෙදා තැබීම | Formatted in `AuditArchiveBundle.getObjectKey()` |
| **Pessimistic Locking** | **Exclusive Database Row Lock**: A database locking mechanism (`SELECT FOR UPDATE`) that forces concurrent users to wait in line so two people never book the same doctor. | එක් අයෙකු වෙන්කරන තුරු අනිත් අයට එම පේළිය අගුළු ලා බලා සිටීමට සැලැස්වීම | `WaitingQueueDispatcherScheduler` & `BookingConfirmationService` |
| **Redis Presence Pool** | **In-Memory Doctor Status**: Tracking active online/on-duty doctors in fast RAM with TTL heartbeats instead of hitting PostgreSQL every second. | Doctor online ද නැද්ද යන්න තත්පරයෙන් තත්පරයට DB නොයා Redis RAM එකේ තබාගැනීම | `DoctorPresenceRegistry` (`hitha:presence:doctors`) |
| **Idempotency** | **Duplicate-Proof Execution**: Guaranteeing that executing the same payment notification multiple times produces the exact same result without double-charging. | එකම payment notification එක කීප සැරයක් ආවත් ගිණුමට මුදල් එකතු වන්නේ එකම එක වතාවක් පමණි | `PaymentServiceImpl.handleNotify` (MD5 validation) |
| **Escrow Custody Vault** | **Intermediate Trust Holding**: Locking patient consultation fees in an intermediary ledger until the doctor finishes the medical consultation call. | Doctor රෝගියා පරීක්ෂා කර අවසන් වන තුරු මුදල් රඳවා තබා ගන්නා ආරක්ෂිත තැන්පතුව | `DoctorWalletService.creditEscrow(booking)` |
| **Server-Sent Events (SSE)** | **Persistent One-Way Web Push**: A lightweight persistent HTTP connection pushing real-time events from server to browser without WebSockets overhead. | Server එකේ සිට Client ට අලුත් තොරතුරු එසැණින් තල්ලු කරන සැහැල්ලු HTTP මාර්ගය | `SseRegistryService` & `SseDomainEventListener` |
| **Transactional Outbox** | **Guaranteed Event Publishing**: Writing domain events to the local database in the same transaction as state changes before publishing asynchronously to prevent lost messages. | දත්ත වෙනස් වීමත් event එකත් එකම DB transaction එකක ලියා පසුපසින් පණිවිඩය යැවීම | `OutboxEventRepository` & `OutboxDispatcherScheduler` |
| **Zero-PHI Sanitization** | **Health Data Masking**: Automatically stripping all Personal Health Information (diagnoses, medical notes) before logging payloads to compliance audit tables. | රෝගියාගේ පෞද්ගලික ලෙඩ රෝග විස්තර ලොග් සටහන් වලින් ඉබේ ඉවත් කර ආරක්ෂා කිරීම | `ClinicalAuditAspect.java` (`maskPhiFields`) |
| **Selective Forwarding Unit (SFU)** | **WebRTC Media Router**: A server that routes audio/video streams between participants without transcoding, keeping CPU usage minimal for multi-party telehealth. | වීඩියෝ call එකක් encode නොකර කෙලින්ම අනිත් අයට බෙදාහරින LiveKit SFU තාක්ෂණය | `LiveKitRoomManager.java` & WebRTC SFU Cluster |
