---
id: subscription-plans-durations
title: Subscription Plans, Monthly Pricing & Session Durations
sidebar_label: Subscriptions & Plans
slug: /financial/subscription-plans-durations
---

import BrowserOnly from '@docusaurus/BrowserOnly';
import FlowDiagram from '@site/src/components/FlowDiagram';
import { subscriptionPlansNodes, subscriptionPlansEdges } from '@site/src/components/FlowDiagram/diagramData';

# Subscription Plans, Monthly Pricing & Session Durations

HITHA provides structured telehealth tiers for individuals, families, and enterprise corporate health packages with dynamic in-call extensions.

<BrowserOnly fallback={<div style={{ height: '380px', background: '#f8fbff', borderRadius: '16px' }} />}>
  {() => (
    <FlowDiagram
      nodes={subscriptionPlansNodes}
      edges={subscriptionPlansEdges}
      height={380}
      caption="Subscription & Duration Flow: Bucket4j validates plan entitlement; LiveKit SFU provisions session with 15m/30m/45m expiry and +15m mid-call extension."
      direction="LR"
    />
  )}
</BrowserOnly>

---

## 1. Subscription Tiers & Entitlements

| Plan Name | Monthly Price (LKR) | Video Consultations Included | Mid-Call Extension Allowance | Priority Dispatch Window |
|:---|:---|:---|:---|:---|
| **Free / Pay-as-you-go** | LKR 0.00 | 0 (Billed per session) | 15m add-on credit card bill | Standard (up to 5m) |
| **Hitha Individual** | LKR 4,500.00 | 2 Monthly Consultations | 1 Free 15m Extension / mo | High Priority (< 45s) |
| **Hitha Family Care** | LKR 12,000.00 | 6 Shared Family Consultations | 3 Free 15m Extensions / mo | Immediate Emergency Jump |
| **Corporate Wellness** | Custom SLA | Unlimited triage + 20 Doctor visits | Included in Corporate Retainer | Dedicated Duty Doctor Pool |

---

## 2. Session Duration Matrix

Consultations are provisioned into discrete time allocations matching clinical psychiatric assessment requirements:
- **15 Minutes (`DURATION_15M`)**: Quick follow-up, prescription refill validation, or post-discharge check-in.
- **30 Minutes (`DURATION_30M`)**: Standard clinical consultation, therapy review, and diagnostic discussion.
- **45 Minutes (`DURATION_45M`)**: Comprehensive initial psychiatric evaluation and cognitive assessment.
