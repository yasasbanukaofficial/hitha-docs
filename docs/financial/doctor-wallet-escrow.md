---
id: doctor-wallet-escrow
title: Doctor Wallet, Escrow Balances & Double-Entry Ledger
sidebar_label: Doctor Wallet & Escrow Ledger
slug: /financial/doctor-wallet-escrow
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

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

<Tabs>
<TabItem value="sinhala" label="📖 සරල සිංහලෙන් (Plain Sinhala)" default>

- **Escrow එකට සල්ලි වැටීම**: Patient කෙනෙක් LKR 3,000 ක consultation එකක් book කර සල්ලි ගෙවූ විට, ඒ මුදල Doctor ට ක්ෂණිකව withdraw කරගත නොහැක. එය යන්නේ Doctor ගේ `escrow_balance` එකටයි (අතරමැදිව lock කර තබා ගැනීම).
- **Available Balance එකට මාරු වීම**: Doctor වීඩියෝ ඇමතුමට සහභාගී වී, consultation එක අවසන් කර complete කළ විට පමණක්, platform commission එක අඩු වී ඉතිරි මුදල `escrow_balance` එකෙන් `available_balance` එකට මාරු වේ.
- **Cancel වීම**: Doctor නොපැමිණියහොත් හෝ call එක fail වුවහොත්, `escrow_balance` එකෙන් මුදල් patient ට refund කරනු ලැබේ.



</TabItem>
<TabItem value="english" label="💡 Technical Defense (English)">

- **Financial Integrity**: Managed via `DoctorWalletService` with transactional record updates on `doctor_wallets` and immutable logs on `wallet_transactions`.
- **Payout Security**: Doctors request payouts to verified Sri Lankan bank accounts. Withdrawals transition through `PENDING_APPROVAL` ➔ `APPROVED` ➔ `SETTLED` with platform audit trails.



</TabItem>
</Tabs>
