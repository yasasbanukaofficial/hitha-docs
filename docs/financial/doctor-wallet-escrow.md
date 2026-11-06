---
id: doctor-wallet-escrow
title: Doctor Wallet, Escrow Balances & Double-Entry Ledger
sidebar_label: Doctor Wallet & Escrow
slug: /financial/doctor-wallet-escrow
---

import BrowserOnly from '@docusaurus/BrowserOnly';
import FlowDiagram from '@site/src/components/FlowDiagram';
import { escrowNodes, escrowEdges, escrowSteps } from '@site/src/components/FlowDiagram/diagramData';

# Doctor Wallet, Escrow Balances & Double-Entry Ledger

HITHA operates a financial ledger ensuring doctor consultation earnings are held in escrow during active telehealth calls and only credited upon consultation completion.

<BrowserOnly fallback={<div style={{ height: '440px', background: '#f8fbff', borderRadius: '16px' }} />}>
  {() => (
    <FlowDiagram
      nodes={escrowNodes}
      edges={escrowEdges}
      steps={escrowSteps}
      scenario="Scenario: Holding consultation fees in escrow until doctor sign-off"
      height={440}
      caption="Double-Entry Escrow Ledger: Patient fees are locked in custodial escrow during consultations and automatically split on doctor sign-off into doctor earnings (85%) and platform maintenance (15%)."
      direction="LR"
    />
  )}
</BrowserOnly>

All financial operations follow double-entry bookkeeping with strict database constraints: no money is created or destroyed without equal debits and credits.

---

## 1. Ledger Split & Platform Commission

When a consultation is confirmed:
1. **Total Patient Fee Paid**: `LKR 4,500.00` received via PayHere gateway.
2. **Escrow Custody**: Full `LKR 4,500.00` held in `LOCKED_IN_ESCROW` status.
3. **Session Completion**:
   - **Doctor Withdrawable (85%)**: `LKR 3,825.00` credited to doctor wallet.
   - **Platform Commission (15%)**: `LKR 675.00` credited to HITHA operational revenue.
