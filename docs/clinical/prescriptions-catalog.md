---
id: prescriptions-catalog
title: Clinical Prescriptions, Drug Catalog & Zero-PHI Compliance
sidebar_label: Prescriptions & Drug Catalog
slug: /clinical/prescriptions-catalog
---

import BrowserOnly from '@docusaurus/BrowserOnly';
import FlowDiagram from '@site/src/components/FlowDiagram';
import { prescriptionsCatalogNodes, prescriptionsCatalogEdges } from '@site/src/components/FlowDiagram/diagramData';

# Clinical Prescriptions, Drug Catalog & Zero-PHI Compliance

Writing and dispensing medical prescriptions requires strict data isolation to comply with healthcare privacy regulations. HITHA separates clinical prescription records from public database queries, enforcing cryptographic masking and zero-PHI (Protected Health Information) exposure in application logs.

<BrowserOnly fallback={<div style={{ height: '380px', background: '#f8fbff', borderRadius: '16px' }} />}>
  {() => (
    <FlowDiagram
      nodes={prescriptionsCatalogNodes}
      edges={prescriptionsCatalogEdges}
      height={380}
      caption="Zero-PHI Prescription Pipeline: Doctor selects medications from NMRA formulary; SHA-256 masking strips patient identity prior to logging and vault encryption."
      direction="LR"
    />
  )}
</BrowserOnly>

---

## 1. Drug Catalog Formulary

The system maintains a standardized formulary mapping approved generic compounds, brand equivalents, dosage routes, and legal dispensing schedules:

- **Schedule II / Controlled Substances**: Requires dual-factor doctor approval and physical verification prior to digital signature generation.
- **Standard Prescriptions**: Digitally signed using the doctor's RSA-2048 private key, generating an immutable, verifiable PDF QR code.

---

## 2. Zero-PHI Logging Policy

Under no circumstances are patient names, diagnoses (ICD-10 codes), or prescribed drugs printed into application logs:

```json
// CORRECT (Sanitized Log Event)
{
  "timestamp": "2026-11-06T11:42:00Z",
  "level": "INFO",
  "correlationId": "8f3b2a9e-10d4-4817-cb38-920491820491",
  "event": "PRESCRIPTION_ISSUED",
  "prescriptionId": "rx_840219",
  "doctorMaskedId": "doc_***401",
  "patientMaskedId": "pat_***914"
}
```
