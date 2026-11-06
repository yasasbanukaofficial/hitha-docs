---
id: intro
title: HITHA System Architecture & Technical Documentation
sidebar_label: Overview & Core Principles
slug: /
---

import BrowserOnly from '@docusaurus/BrowserOnly';
import FlowDiagram from '@site/src/components/FlowDiagram';
import { heroNodes, heroEdges, heroSteps } from '@site/src/components/FlowDiagram/diagramData';

# HITHA System Architecture & Technical Documentation

Welcome to the **HITHA Healthcare Engineering & Architecture Portal**. This documentation serves as the comprehensive technical reference for the platform's distributed systems, healthcare compliance pipelines, tele-mental-health infrastructure, and architectural blueprints.

<BrowserOnly fallback={<div style={{ height: '420px', background: '#f8fbff', borderRadius: '16px' }} />}>
  {() => (
    <FlowDiagram
      nodes={heroNodes}
      edges={heroEdges}
      steps={heroSteps}
      height={420}
      caption="HITHA Distributed System Topology: Client apps connect through Spring Boot 3.3 virtual threads, orchestrated with Redis 7.2 presence, PostgreSQL 16 ACID storage, LiveKit SFU, and Cloudflare R2 7-year WORM archival."
      direction="LR"
    />
  )}
</BrowserOnly>

---

## 🎯 What is HITHA?

**HITHA** is an enterprise tele-mental-health ecosystem providing secure real-time WebRTC consultations, digital prescription management, on-demand doctor dispatching, and escrow-backed payments.

- **Zero-Trust Identity**: Patients can access care anonymously using verified pseudonyms to eliminate social stigma.
- **On-Demand Emergency Care**: Instant queue dispatcher that pairs distressed patients with available on-duty doctors within seconds.
- **Cryptographic Traceability**: All financial transactions and patient record views are permanently chained with cryptographic SHA-256 hashes to guarantee data immutability.

---

## 🏛️ Core Architectural Pillars

1. **Dual-Plane Logging Model**: High-frequency operational logs are stored in 5GB capped local rolling files, while legally-binding compliance audit logs are stored in PostgreSQL with SHA-256 hash chaining and 7-year Cloudflare R2 archival.
2. **Multi-Tier Distributed Rate Limiting**: Tiered Bucket4j token buckets enforced at the filter level to protect PostgreSQL and HikariCP connection pools from DoS attacks.
3. **Double-Entry Escrow Ledger**: Patient fees remain securely locked in escrow until the doctor marks the consultation session complete.
4. **Sub-10ms Partition Detach**: Database bloat is permanently eliminated by partitioning audit tables monthly and dropping cold partitions after archival to object storage.
