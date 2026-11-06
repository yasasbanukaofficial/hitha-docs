import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Live Video',
      collapsed: true,
      items: [
        'intro',
      ],
    },
    {
      type: 'category',
      label: 'Voice Conferencing',
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
      label: 'Interactive Livestream',
      collapsed: true,
      items: [
        'logging-audit/dual-plane-architecture',
      ],
    },
    {
      type: 'category',
      label: 'Capabilities',
      collapsed: true,
      items: [
        'security/rate-limiting',
        'security/sse-token-refresh',
        'security/rbac-superadmin',
      ],
    },
    {
      type: 'category',
      label: 'REST APIs',
      collapsed: true,
      items: [
        'financial/payhere-webhook-idempotency',
        'financial/doctor-wallet-escrow',
        'financial/subscription-plans-durations',
      ],
    },
    {
      type: 'category',
      label: 'Architecture & System Reference',
      collapsed: true,
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
