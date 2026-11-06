---
id: subscription-plans-durations
title: Subscription Plans, Monthly Prices & Multi-Session Durations
sidebar_label: Subscriptions & Session Durations
slug: /financial/subscription-plans-durations
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Subscription Plans, Monthly Prices & Multi-Session Durations

HITHA supports both pay-per-call bookings and monthly healthcare subscriptions granting allotted session quotas across multiple tiers.

---

## 📦 Tier Matrix & Multi-Session Durations

<Tabs>
<TabItem value="sinhala" label="📖 සරල සිංහලෙන් (Plain Sinhala)" default>

- **Multi-Session Duration Selection (CALL-EXT-01)**: Patient කෙනෙක් Call Now එකක් දාන විට, තමන්ගේ subscription plan එක අනුව කැමති session duration එකක් තෝරාගත හැක (විනාඩි 15, 30, හෝ 45).
- **Subscription Quota Ledger**: Patient කෙනෙක්ගේ මාසික plan එකෙන් sessions කොපමණ ඉතිරිද යන්න `subscription_quota_ledger` එකෙන් පාලනය වේ.
- **Bug Fix (BUG-QUOTA-01)**: Eligibility check එකක් කරද්දී PostgreSQL read-only transaction එකක් නිසා database lock වීමක් ඇතිවූ අතර, එය eligibility query එක වෙනම transaction එකකට decouple කර විසඳා ඇත (`db3bb1f`).



</TabItem>
<TabItem value="english" label="💡 Technical Defense (English)">

- **Entitlement Ledger**: `SubscriptionQuotaServiceImpl` validates active cycles and enforces quota consumption. 
- **Durations**: Standard packages support 15-minute, 30-minute, 45-minute, and 60-minute mental health counseling sessions with mid-call extension capabilities.



</TabItem>
</Tabs>
