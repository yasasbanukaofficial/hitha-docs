---
id: payhere-webhook-idempotency
title: PayHere Payment Gateway, Webhooks & Idempotency
sidebar_label: PayHere Webhook Idempotency
slug: /financial/payhere-webhook-idempotency
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# PayHere Payment Gateway, Webhooks & Idempotency

Online payments in Sri Lanka (credit cards, eZ Cash, LankaQR) are processed through PayHere. Network drops and merchant retries necessitate a strict idempotency model.

---

## 💳 Payment Flow & Idempotency Guarantee

<Tabs>
<TabItem value="sinhala" label="📖 සරල සිංහලෙන් (Plain Sinhala)" default>

- **ගැටලුව**: PayHere එකෙන් payment එකක් සාර්ථක වූ විට අපේ backend එකට webhook එකක් එවනවා. Network delay එකක් නිසා PayHere එකෙන් එකම webhook එක 2-3 වතාවක් එවන්න පුළුවන් (Retry). මේක නිවැරදිව පාලනය නොකළහොත්, එකම booking එකට Doctor ගේ wallet එකට 2-3 වතාවක් සල්ලි වැටෙන්න හෝ double-credit වෙන්න පුළුවන්.
- **විසඳුම (Idempotency)**:
  1. PayHere එකෙන් එවන `md5sig` එක අපේ merchant secret එකෙන් verify කර හොර webhooks block කරනවා.
  2. `payment_reference` එක Database එකේ `UNIQUE` කර ඇත.
  3. එකම webhook එක දෙවැනි වර ආවොත්, backend එක එය දැනටමත් process කර ඇති බව හඳුනාගෙන, කිසිදු මුදල් වෙනසක් නොකර ක්ෂණිකව `200 OK` ආපසු යවයි.


</TabItem>
<TabItem value="english" label="💡 Technical Defense (English)">

- **Signature Verification**: Every incoming webhook calculates `strtoupper(md5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + strtoupper(md5(merchant_secret))))` to prevent packet tampering.
- **Transactional Idempotency**: `PaymentServiceImpl.handleNotify()` executes under pessimistic lock on the payment record. Duplicate callback executions are dropped without altering wallet balances.



</TabItem>
</Tabs>
