---
id: prescriptions-catalog
title: Clinical Prescriptions, Drug Catalog & Zero-PHI Compliance
sidebar_label: Prescriptions & Drug Formulary
slug: /clinical/prescriptions-catalog
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Clinical Prescriptions, Drug Catalog & Zero-PHI Compliance

HITHA incorporates a Sri Lankan drug formulary and digital prescription system adhering strictly to the Medical Ordinance and clinical confidentiality regulations.

---

## 💊 Clinical Integrity & Privacy

<Tabs>
<TabItem value="sinhala" label="📖 සරල සිංහලෙන් (Plain Sinhala)" default>

- **E-Prescription Creation**: Consultation එකක් අවසානයේ Doctor ට approved drug catalog එකෙන් බෙහෙත් තෝරා, dosage එක සහ උපදෙස් ඇතුළත් කර digital prescription එකක් issue කළ හැක.
- **Zero-PHI Logging Rule**: Audit log එකක් ලියවෙද්දී හෝ error එකක් log වෙද්දී, කිසිම වෙලාවක ලෙඩාගේ රෝග විනිශ්චය (Diagnosis) හෝ බෙහෙත් නම් logs වල print වීමට ඉඩ නොදේ (`Zero-PHI Rule`). ලියවෙන්නේ `prescriptionId` සහ `action=PRESCRIPTION_ISSUED` යන metadata පමණි.
- **Public Verification Token**: ෆාමසියකට ගිය විට prescription එක සත්‍ය එකක්දැයි බැලීමට unique QR verification token එකක් ජනනය වේ.



</TabItem>
<TabItem value="english" label="💡 Technical Defense (English)">

- **Drug Formulary**: Backed by pre-seeded Sri Lankan pharmaceutical drugs (`024-seed-drug-catalog.yaml`). Doctors query drugs via cached Redis endpoints.
- **Audit Aspect Sanitization**: `ClinicalAuditAspect` intercepts all clinical save and read operations. The advice and clinical note payloads are strictly stripped of Personal Health Information (PHI) before metadata is passed to the audit engine.



</TabItem>
</Tabs>
