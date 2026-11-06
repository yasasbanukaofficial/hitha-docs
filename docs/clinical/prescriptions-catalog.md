---
id: prescriptions-catalog
title: Clinical Prescriptions, Drug Catalog & Zero-PHI Compliance
sidebar_label: Prescriptions & Drug Formulary
slug: /clinical/prescriptions-catalog
---


# Clinical Prescriptions, Drug Catalog & Zero-PHI Compliance

HITHA incorporates a Sri Lankan drug formulary and digital prescription system adhering strictly to the Medical Ordinance and clinical confidentiality regulations.

---

## 💊 Clinical Integrity & Privacy

- **Drug Formulary**: Backed by pre-seeded Sri Lankan pharmaceutical drugs (`024-seed-drug-catalog.yaml`). Doctors query drugs via cached Redis endpoints.
- **Audit Aspect Sanitization**: `ClinicalAuditAspect` intercepts all clinical save and read operations. The advice and clinical note payloads are strictly stripped of Personal Health Information (PHI) before metadata is passed to the audit engine.
