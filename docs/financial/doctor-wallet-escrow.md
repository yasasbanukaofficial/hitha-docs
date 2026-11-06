---
id: doctor-wallet-escrow
title: Doctor Wallet, Escrow Balances & Double-Entry Ledger
sidebar_label: Doctor Wallet & Escrow Ledger
slug: /financial/doctor-wallet-escrow
---


# Doctor Wallet, Escrow Balances & Double-Entry Ledger

To protect patient funds while ensuring medical professionals receive timely payouts, HITHA enforces an **Escrow Custody Model** backed by double-entry accounting.

<div className="arch-diagram-wrapper">
  <img src="/img/diagrams/escrow-ledger-split.svg" alt="Doctor Escrow Custody & Double Entry Ledger" width="100%" />
  <div className="arch-diagram-caption">
    <span><b>Figure 4.0:</b> Double-Entry Escrow Custody &amp; Platform Commission Deductions</span>
    <span className="arch-diagram-badge">PAY-02 &amp; LEDGER</span>
  </div>
</div>

---

## 🏦 Escrow Settlement Mechanism

- **Financial Integrity**: Managed via `DoctorWalletService` with transactional record updates on `doctor_wallets` and immutable logs on `wallet_transactions`.
- **Payout Security**: Doctors request payouts to verified Sri Lankan bank accounts. Withdrawals transition through `PENDING_APPROVAL` ➔ `APPROVED` ➔ `SETTLED` with platform audit trails.
