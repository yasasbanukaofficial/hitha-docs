---
id: payhere-webhook-idempotency
title: PayHere Payment Gateway, Webhooks & Idempotency
sidebar_label: PayHere Webhook Idempotency
slug: /financial/payhere-webhook-idempotency
---


# PayHere Payment Gateway, Webhooks & Idempotency

Online payments in Sri Lanka (credit cards, eZ Cash, LankaQR) are processed through PayHere. Network drops and merchant retries necessitate a strict idempotency model.

---

## 💳 Payment Flow & Idempotency Guarantee

- **Signature Verification**: Every incoming webhook calculates `strtoupper(md5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + strtoupper(md5(merchant_secret))))` to prevent packet tampering.
- **Transactional Idempotency**: `PaymentServiceImpl.handleNotify()` executes under pessimistic lock on the payment record. Duplicate callback executions are dropped without altering wallet balances.
