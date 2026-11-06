---
id: payhere-webhook-idempotency
title: PayHere Payment Gateway, Webhooks & Idempotency
sidebar_label: PayHere Webhook Idempotency
slug: /financial/payhere-webhook-idempotency
---

# PayHere Payment Gateway, Webhooks & Idempotency

HITHA integrates with PayHere to accept local credit/debit cards, FriMi, and bank transfers across Sri Lanka. Because payment gateway webhooks can be retried multiple times or delivered out-of-order over unreliable networks, strict cryptographic verification and database idempotency keys are enforced.

---

## 1. Webhook Signature Verification

Every incoming notification payload from PayHere contains an `md5sig` signature. HITHA validates this signature before processing the transaction:

```text
md5sig = MD5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + MD5(merchant_secret))
```

```java
public boolean verifyPayHereSignature(PayHereWebhookRequest request) {
    String secretHash = DigestUtils.md5Hex(merchantSecret).toUpperCase();
    String formattedAmount = String.format(Locale.US, "%.2f", request.getPayhereAmount());
    String rawPayload = merchantId + request.getOrderId() + formattedAmount 
                        + request.getPayhereCurrency() + request.getStatusCode() + secretHash;
    String calculatedSig = DigestUtils.md5Hex(rawPayload).toUpperCase();
    return calculatedSig.equalsIgnoreCase(request.getMd5sig());
}
```

---

## 2. Idempotent Processing Flow

1. **Lock on Payment Intent**: When the webhook arrives at `POST /api/v1/payments/payhere/notify`, `PaymentWebhookService` executes a pessimistic lookup on the `payments` table matching `order_id`.
2. **Duplicate Detection**:
   - If the payment state is already `COMPLETED`, the handler immediately returns `HTTP 200 OK` without modifying ledger balances or re-triggering notifications.
   - If `PENDING`, the state transitions to `COMPLETED`, holding the amount in the doctor's escrow wallet.
3. **Outbox Event Dispatch**: A `PaymentReceivedEvent` is appended into the transactional outbox table in the same database transaction.
