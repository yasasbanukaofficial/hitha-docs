import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Guides',
      collapsed: false,
      items: [
        'intro',
      ],
    },
    {
      type: 'category',
      label: 'Clinical & Telehealth Engine',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'clinical/livekit-webrtc',
          label: 'Server Integration',
        },
        'clinical/on-demand-queue',
        'clinical/prescriptions-catalog',
      ],
    },
    {
      type: 'category',
      label: 'Logging, Audit & Storage Lifecycle',
      collapsed: false,
      items: [
        'logging-audit/dual-plane-architecture',
        'logging-audit/task-roadmap-and-progress',
        'logging-audit/deep-technical-mechanisms',
      ],
    },
    {
      type: 'category',
      label: 'Security & Distributed Rate Limiting',
      collapsed: false,
      items: [
        'security/rate-limiting',
        'security/sse-token-refresh',
        'security/rbac-superadmin',
      ],
    },
    {
      type: 'category',
      label: 'Financial, Payments & Wallets',
      collapsed: false,
      items: [
        'financial/payhere-webhook-idempotency',
        'financial/doctor-wallet-escrow',
        'financial/subscription-plans-durations',
      ],
    },
    {
      type: 'category',
      label: 'Architecture Glossary & Reference',
      collapsed: false,
      items: [
        'reference/technical-terms-dictionary',
        'reference/database-indexing-optimization',
        'reference/caching-architecture',
        'reference/transactional-outbox-pattern',
        'reference/background-schedulers',
        'engineering-timeline/daily-timeline',
      ],
    },
  ],
};

export default sidebars;
