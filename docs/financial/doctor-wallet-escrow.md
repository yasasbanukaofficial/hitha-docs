---
id: doctor-wallet-escrow
title: Doctor Wallet, Escrow Balances & Double-Entry Ledger
sidebar_label: Doctor Wallet & Escrow
slug: /financial/doctor-wallet-escrow
---

# Doctor Wallet, Escrow Balances & Double-Entry Ledger

HITHA operates a financial ledger ensuring doctor consultation earnings are held in escrow during active telehealth calls and only credited upon consultation completion.

<div className="dyte-diagram-container">
  <img src="/img/diagrams/escrow-ledger-split.svg" alt="Doctor Wallet Escrow & Double-Entry Ledger Architecture" width="100%" />
</div>

All financial operations follow double-entry bookkeeping with strict database constraints: no money is created or destroyed without equal debits and credits.

---

## 1. Ledger Split & Platform Commission

When a consultation is confirmed:
1. **Total Patient Fee Paid**: `LKR 3,500.00` received via PayHere gateway.
2. **Escrow Custody**: Full `LKR 3,500.00` held in `LOCKED_IN_ESCROW` status.
3. **Session Completion**:
   - **Doctor Withdrawable (80%)**: `LKR 2,800.00` credited to doctor wallet.
   - **Platform Commission (20%)**: `LKR 700.00` credited to HITHA operational revenue.
