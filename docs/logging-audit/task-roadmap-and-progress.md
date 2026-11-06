---
id: task-roadmap-and-progress
title: Logging, Audit & Cloud Archival Roadmap
sidebar_label: Task Roadmap & Progress
slug: /logging-audit/task-roadmap-and-progress
---

# Logging, Audit & Cloud Archival Roadmap

This document outlines the architectural lifecycle of audit log storage, cold data migration to Cloudflare R2, and compliance governance.

<div className="dyte-diagram-container">
  <img src="/img/diagrams/cloudflare-r2-archival.svg" alt="Cloudflare R2 Cold Archival Architecture" width="100%" />
</div>

Audit logs older than 90 days are automatically exported to GZIP-compressed JSON Lines (`.jsonl.gz`), signed with a cryptographic SHA-256 manifest, and placed into Cloudflare R2 object storage with 7-year WORM lock protection.
