import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: '1. Logging, Audit & Storage Lifecycle',
      collapsed: false,
      items: [
        'logging-audit/dual-plane-architecture',
        'logging-audit/task-roadmap-and-progress',
        'logging-audit/deep-technical-mechanisms',
      ],
    },
    {
      type: 'category',
      label: '2. Security, Rate Limiting & Auth',
      collapsed: false,
      items: [
        'security/rate-limiting',
        'security/sse-token-refresh',
        'security/rbac-superadmin',
      ],
    },
    {
      type: 'category',
      label: '3. Clinical, Telehealth & RTC',
      collapsed: false,
      items: [
        'clinical/livekit-webrtc',
        'clinical/on-demand-queue',
        'clinical/prescriptions-catalog',
      ],
    },
    {
      type: 'category',
      label: '4. Financial, Payments & Wallets',
      collapsed: false,
      items: [
        'financial/payhere-webhook-idempotency',
        'financial/doctor-wallet-escrow',
        'financial/subscription-plans-durations',
      ],
    },
    {
      type: 'category',
      label: '5. Architecture Glossary & Reference',
      collapsed: false,
      items: [
        'reference/technical-terms-dictionary',
        'reference/database-indexing-optimization',
        'reference/caching-architecture',
        'reference/transactional-outbox-pattern',
        'reference/background-schedulers',
      ],
    },
    {
      type: 'category',
      label: '6. Engineering Daily Timeline',
      collapsed: false,
      items: [
        'engineering-timeline/daily-timeline',
      ],
    },
  ],
};

export default sidebars;
