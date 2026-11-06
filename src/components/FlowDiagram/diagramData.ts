import { Node, Edge } from '@xyflow/react';

// ========================================================
// 1. PAYMENT FLOW SCENARIO (Replaces cramped PayHere diagram)
// Scenario: "A patient pays for a consultation"
// ========================================================
export const paymentFlowNodes: Node[] = [
  {
    id: 'patient',
    type: 'logoNode',
    data: {
      logo: 'patient',
      title: 'Patient App',
      caption: 'Selects consultation',
      badge: 'Client',
      badgeColor: '#16a34a',
      details: {
        className: 'PatientCheckoutController.java',
        description: 'Patient initiates booking and selects 15m/30m consultation tier.',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'payhere',
    type: 'logoNode',
    data: {
      logo: 'payhere',
      title: 'PayHere Gateway',
      caption: 'Card / LankaQR payment',
      badge: 'Verified',
      badgeColor: '#0284c7',
      details: {
        className: 'PayHereWebhookHandler.java',
        description: 'Payment gateway captures funds and signs webhook with MD5 HMAC.',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'server',
    type: 'logoNode',
    data: {
      logo: 'spring-boot',
      title: 'Spring Boot Engine',
      caption: 'Checks genuine payment',
      badge: 'MD5 Verified',
      badgeColor: '#16a34a',
      details: {
        className: 'PaymentSecurityValidator.java',
        description: 'Validates cryptographic checksum and extracts order identification.',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'database',
    type: 'logoNode',
    data: {
      logo: 'postgresql',
      title: 'PostgreSQL 16',
      caption: 'Locks payment record',
      badge: 'Row Locked',
      badgeColor: '#0284c7',
      details: {
        className: 'PaymentTransactionRepository.java',
        description: 'Executes row lock to prevent duplicate webhook delivery from double-crediting.',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'wallet',
    type: 'logoNode',
    data: {
      logo: 'hitha',
      title: 'Doctor Wallet',
      caption: 'Funds held in escrow',
      badge: 'Escrow Lock',
      badgeColor: '#d97706',
      details: {
        className: 'EscrowLedgerService.java',
        description: 'Retains funds in custodial escrow until consultation sign-off.',
      },
    },
    position: { x: 0, y: 0 },
  },
];

export const paymentFlowEdges: Edge[] = [
  { id: 'e1', source: 'patient', target: 'payhere', label: 'pays consultation fee', animated: true },
  { id: 'e2', source: 'payhere', target: 'server', label: 'payment confirmed', animated: true },
  { id: 'e3', source: 'server', target: 'database', label: 'locks payment record' },
  { id: 'e4', source: 'database', target: 'wallet', label: 'funds held in escrow', style: { stroke: '#d97706', strokeWidth: 2 } },
];

export const paymentFlowSteps = [
  { step: 1, nodeId: 'patient', description: 'Patient selects consultation and proceeds to secure checkout.' },
  { step: 2, nodeId: 'payhere', description: 'PayHere captures patient payment and dispatches signed confirmation.' },
  { step: 3, nodeId: 'server', description: 'Spring Boot checks the cryptographic signature to verify genuine payment.' },
  { step: 4, nodeId: 'database', description: 'Database row is locked so duplicate notifications cannot credit twice.' },
  { step: 5, nodeId: 'wallet', description: 'Funds remain securely locked in escrow until consultation completion.' },
];

// ========================================================
// 2. OVERVIEW HERO (Dual-Plane Logging)
// Scenario: "Handling requests across operational and compliance tiers"
// ========================================================
export const dualPlaneHeroNodes: Node[] = [
  {
    id: 'http',
    type: 'logoNode',
    data: {
      logo: 'spring-boot',
      title: 'Spring Boot 3.3',
      caption: 'Perimeter gateway',
      badge: 'Java 21',
      badgeColor: '#16a34a',
      details: {
        className: 'DispatcherServlet.java',
        description: 'Non-blocking Virtual Thread ingress handling client API calls.',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'filter',
    type: 'infoNode',
    data: {
      badge: 'Diagnostic Tags',
      title: 'Request Tagging',
      caption: 'adds who / role / IP / region',
      color: '#00a8b5',
      details: {
        className: 'CorrelationIdFilter.java',
        description: 'Binds 5 diagnostic MDC tags (correlationId, actorId, role, clientIp, jurisdiction) to thread context.',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'planeA',
    type: 'logoNode',
    data: {
      logo: 'logback',
      title: 'Logback Async',
      caption: '8,192 Ring Buffer',
      badge: 'Zero Disk Wait',
      badgeColor: '#2563eb',
      details: {
        className: 'logback-spring.xml',
        description: 'Non-blocking RingBuffer appender writing hourly 100MB chunked files.',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'localDisk',
    type: 'logoNode',
    data: {
      logo: 'disk',
      title: 'Local Rolling Disk',
      caption: 'Plane A: 5GB capped storage',
      badge: 'Auto-Eviction',
      badgeColor: '#16a34a',
      details: {
        className: 'logback-spring.xml',
        description: 'Hourly 100MB compressed GZIP files with 14-day automated FIFO eviction.',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'planeB',
    type: 'logoNode',
    data: {
      logo: 'postgresql',
      title: 'PostgreSQL 16',
      caption: 'Plane B: Legal Records',
      badge: 'SHA-256 Chain',
      badgeColor: '#0284c7',
      details: {
        className: 'AuditLogServiceImpl.java',
        description: 'Cryptographically sealed audit trail with BRIN range indexing.',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'r2',
    type: 'logoNode',
    data: {
      logo: 'cloudflare-r2',
      title: 'Cloudflare R2',
      caption: '7-Year Cold Storage',
      badge: 'WORM Vault',
      badgeColor: '#f97316',
      details: {
        className: 'AuditLogArchiveServiceImpl.java',
        description: 'Cold export of records older than 90 days with SHA-256 manifests.',
      },
    },
    position: { x: 0, y: 0 },
  },
];

export const dualPlaneHeroEdges: Edge[] = [
  { id: 'e1', source: 'http', target: 'filter', animated: true },
  { id: 'e2', source: 'filter', target: 'planeA', label: 'debug & operational logs', style: { stroke: '#2563eb', strokeWidth: 2 } },
  { id: 'e3', source: 'planeA', target: 'localDisk', label: 'hourly gzip rolling', style: { stroke: '#16a34a', strokeWidth: 2 } },
  { id: 'e4', source: 'filter', target: 'planeB', label: 'legal compliance audits', style: { stroke: '#0284c7', strokeWidth: 2 } },
  { id: 'e5', source: 'planeB', target: 'r2', label: '90+ days cold stream', style: { stroke: '#f97316', strokeWidth: 2, strokeDasharray: '4,4' } },
];

export const dualPlaneHeroSteps = [
  { step: 1, nodeId: 'http', description: 'Patient or doctor request arrives at the API perimeter.' },
  { step: 2, nodeId: 'filter', description: 'Request tagging adds user ID, role, IP address, and region tags.' },
  { step: 3, nodeId: 'planeA', description: 'Operational traces are queued in Logback AsyncAppender 8,192 ring buffer.' },
  { step: 4, nodeId: 'localDisk', description: 'Plane A logs write to local disk with 100MB hourly GZIP rolling and 5GB cap.' },
  { step: 5, nodeId: 'planeB', description: 'Immutable clinical compliance records commit to PostgreSQL (Plane B).' },
  { step: 6, nodeId: 'r2', description: 'Records older than 90 days migrate to Cloudflare R2 7-year WORM cold storage.' },
];

export const heroNodes = dualPlaneHeroNodes;
export const heroEdges = dualPlaneHeroEdges;
export const heroSteps = dualPlaneHeroSteps;

// ========================================================
// 3. LOG-01: NON-BLOCKING LOGGING PIPELINE
// Scenario: "A patient opens the doctor list while the server is busy"
// ========================================================
export const log01Nodes: Node[] = [
  {
    id: 'patient',
    type: 'logoNode',
    data: {
      logo: 'patient',
      title: 'Patient App',
      caption: 'opens doctor list',
      badge: 'Active User',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'api',
    type: 'logoNode',
    data: {
      logo: 'spring-boot',
      title: 'Spring Boot API',
      caption: 'tags request identity',
      badge: 'Virtual Thread',
      badgeColor: '#16a34a',
      details: {
        className: 'DoctorDirectoryController.java',
        description: 'Emits response immediately while enqueueing logging event.',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'queue',
    type: 'infoNode',
    data: {
      badge: '8,192 CAPACITY',
      title: 'Memory Ring Buffer',
      caption: 'log line queued instantly',
      color: '#2563eb',
      details: {
        className: 'AsyncAppender.java',
        description: 'LMAX Disruptor ring buffer separating request threads from disk IO.',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'disk',
    type: 'logoNode',
    data: {
      logo: 'logback',
      title: 'Server Disk Logs',
      caption: 'written in background',
      badge: '100 MB Chunks',
      badgeColor: '#2563eb',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'archive',
    type: 'infoNode',
    data: {
      badge: '14-DAY CLEANUP',
      title: 'Archive Folder',
      caption: '5 GB maximum cap',
      color: '#d97706',
    },
    position: { x: 0, y: 0 },
  },
];

export const log01Edges: Edge[] = [
  { id: 'e1', source: 'patient', target: 'api', label: 'opens doctor list', animated: true },
  { id: 'e2', source: 'api', target: 'patient', label: 'response sent instantly', style: { stroke: '#16a34a', strokeWidth: 2, strokeDasharray: '4,4' } },
  { id: 'e3', source: 'api', target: 'queue', label: 'log line queued', animated: true },
  { id: 'e4', source: 'queue', target: 'disk', label: 'written in background' },
  { id: 'e5', source: 'disk', target: 'archive', label: 'zipped hourly or 100MB' },
];

export const log01Steps = [
  { step: 1, nodeId: 'patient', description: 'Patient requests doctor list from mobile app.' },
  { step: 2, nodeId: 'api', description: 'Server processes request and dispatches immediate response back to patient.' },
  { step: 3, nodeId: 'queue', description: 'Log statement is placed in an 8,192 memory queue without slowing user.' },
  { step: 4, nodeId: 'disk', description: 'Background worker writes log lines to disk in 100MB gzip chunks.' },
  { step: 5, nodeId: 'archive', description: 'Old logs are auto-deleted when exceeding 5GB or 14 days.' },
];

// ========================================================
// 4. LOG-02: TAMPER-PROOF AUDIT CHAIN (Before vs After)
// Scenario: "A doctor edits a prescription at the same instant an admin changes a role"
// ========================================================
export const log02BeforeNodes: Node[] = [
  {
    id: 'doctor',
    type: 'logoNode',
    data: {
      logo: 'doctor',
      title: 'Doctor Action',
      caption: 'edits prescription',
      badge: 'Thread A',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'admin',
    type: 'logoNode',
    data: {
      logo: 'admin',
      title: 'Admin Action',
      caption: 'modifies role',
      badge: 'Thread B',
      badgeColor: '#00a8b5',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'collision',
    type: 'infoNode',
    data: {
      badge: 'RACE CONDITION',
      title: 'Read Same Parent Hash',
      caption: 'Both threads read simultaneously',
      color: '#dc2626',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'splitChain',
    type: 'infoNode',
    data: {
      badge: 'CHAIN FORKED',
      title: 'Broken Audit Chain',
      caption: 'Two records point to same block',
      color: '#dc2626',
    },
    position: { x: 0, y: 0 },
  },
];

export const log02BeforeEdges: Edge[] = [
  { id: 'e1', source: 'doctor', target: 'collision', label: 'reads parent hash', animated: true },
  { id: 'e2', source: 'admin', target: 'collision', label: 'reads same hash', animated: true },
  { id: 'e3', source: 'collision', target: 'splitChain', label: 'creates competing branches', style: { stroke: '#dc2626', strokeWidth: 2 } },
];

export const log02AfterNodes: Node[] = [
  {
    id: 'doctor',
    type: 'logoNode',
    data: {
      logo: 'doctor',
      title: 'Doctor Action',
      caption: 'edits prescription',
      badge: 'Thread A',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'admin',
    type: 'logoNode',
    data: {
      logo: 'admin',
      title: 'Admin Action',
      caption: 'modifies role',
      badge: 'Thread B',
      badgeColor: '#00a8b5',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'gate',
    type: 'logoNode',
    data: {
      logo: 'lock',
      title: 'Single-File Gate',
      caption: 'threads wait in line',
      badge: 'JVM Lock',
      badgeColor: '#16a34a',
      details: {
        className: 'AuditLogServiceImpl.java',
        description: 'ReentrantLock serializes hash reading and block insertion across concurrent virtual threads.',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'dbChain',
    type: 'logoNode',
    data: {
      logo: 'postgresql',
      title: 'PostgreSQL Chain',
      caption: 'Block 1 -> Block 2 -> Block 3',
      badge: '20 Threads Tested',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
];

export const log02AfterEdges: Edge[] = [
  { id: 'e1', source: 'doctor', target: 'gate', label: 'waits in line', animated: true },
  { id: 'e2', source: 'admin', target: 'gate', label: 'waits in line', animated: true },
  { id: 'e3', source: 'gate', target: 'dbChain', label: 'writes one at a time', style: { stroke: '#16a34a', strokeWidth: 2 } },
];

export const log02Nodes = log02AfterNodes;
export const log02Edges = log02AfterEdges;
export const log02Steps = [
  { step: 1, nodeId: 'doctor', description: 'Doctor and Admin trigger actions at the exact same millisecond.' },
  { step: 2, nodeId: 'gate', description: 'Single-file gate ensures each thread acquires exclusive permission in turn.' },
  { step: 3, nodeId: 'dbChain', description: 'Tested with 20 simultaneous requests: sequential cryptographic chain stays intact.' },
];

// ========================================================
// 5. LOG-03: PROTECTING DATABASE FROM LOGIN FLOOD
// Scenario: "A bot hammers the login endpoint while real patients keep booking"
// ========================================================
export const log03Nodes: Node[] = [
  {
    id: 'bot',
    type: 'logoNode',
    data: {
      logo: 'bot',
      title: 'Attacker Bot',
      caption: '1000s of failed logins',
      badge: 'Malicious',
      badgeColor: '#dc2626',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'patient',
    type: 'logoNode',
    data: {
      logo: 'patient',
      title: 'Patient App',
      caption: 'books appointment',
      badge: 'Legitimate',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'gateway',
    type: 'logoNode',
    data: {
      logo: 'spring-boot',
      title: 'Spring Boot Gate',
      caption: 'rejects with 401',
      badge: 'Per-IP Limit',
      badgeColor: '#dc2626',
      details: {
        className: 'AuditAuthenticationEntryPoint.java',
        description: 'Evaluates in-memory sliding window rate limit without database query.',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'pool',
    type: 'infoNode',
    data: {
      badge: '8 SLOTS KEPT FREE',
      title: 'Database Pool',
      caption: 'zero connection exhaustion',
      color: '#16a34a',
      details: {
        className: 'HikariDataSource.java',
        description: 'Fixed 8 database connections remain reserved for paying patients.',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'db',
    type: 'logoNode',
    data: {
      logo: 'postgresql',
      title: 'PostgreSQL 16',
      caption: 'real users stay fast',
      badge: 'Protected',
      badgeColor: '#0284c7',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'diskLogs',
    type: 'logoNode',
    data: {
      logo: 'logback',
      title: 'Server Log Files',
      caption: 'flood written to disk only',
      badge: 'No DB Hit',
      badgeColor: '#64748b',
    },
    position: { x: 0, y: 0 },
  },
];

export const log03Edges: Edge[] = [
  { id: 'e1', source: 'bot', target: 'gateway', label: 'flood failed passwords', animated: true, style: { stroke: '#dc2626' } },
  { id: 'e2', source: 'gateway', target: 'diskLogs', label: 'over limit: to log file', style: { stroke: '#64748b' } },
  { id: 'e3', source: 'patient', target: 'gateway', label: 'books appointment', animated: true },
  { id: 'e4', source: 'gateway', target: 'pool', label: 'acquires free connection', style: { stroke: '#16a34a' } },
  { id: 'e5', source: 'pool', target: 'db', label: 'saves booking safely', style: { stroke: '#0284c7', strokeWidth: 2 } },
];

export const log03Steps = [
  { step: 1, nodeId: 'bot', description: 'Bot hammers login endpoint with invalid credentials.' },
  { step: 2, nodeId: 'gateway', description: 'Per-IP counter detects attack and drops bursts after 5 failed attempts.' },
  { step: 3, nodeId: 'diskLogs', description: 'Attack traces write directly to disk files, consuming zero database connections.' },
  { step: 4, nodeId: 'patient', description: 'Real patient books appointment with sub-50ms database response.' },
  { step: 5, nodeId: 'pool', description: 'Database pool slots stay available for legitimate clinical consultations.' },
];

// ========================================================
// 6. LOG-04: FASTER WRITES AND INSTANT DASHBOARD
// Scenario: "Every audit record is written to database with instant dashboard"
// ========================================================
export const log04Nodes: Node[] = [
  {
    id: 'admin',
    type: 'logoNode',
    data: {
      logo: 'admin',
      title: 'Admin Dashboard',
      caption: 'opens activity page',
      badge: 'Auditor View',
      badgeColor: '#00a8b5',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'api',
    type: 'logoNode',
    data: {
      logo: 'spring-boot',
      title: 'Spring Boot Core',
      caption: 'checks 60s cache first',
      badge: 'Optimized',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'cache',
    type: 'infoNode',
    data: {
      badge: '60s MEMORY CACHE',
      title: 'In-Memory Stats',
      caption: 'answered under 50 ms',
      color: '#16a34a',
      details: {
        className: 'AdminActivityLogServiceImpl.java',
        description: 'Caffeine in-memory cache holding pre-aggregated audit counters.',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'brinDb',
    type: 'logoNode',
    data: {
      logo: 'postgresql',
      title: 'PostgreSQL 16',
      caption: '18 MB compact index',
      badge: '11.6x Faster Writes',
      badgeColor: '#0284c7',
      details: {
        className: '004-optimize-audit-logs-indexes.yaml',
        description: 'BRIN index reduced storage by 99.8% compared to original 12GB GIN index.',
      },
    },
    position: { x: 0, y: 0 },
  },
];

export const log04Edges: Edge[] = [
  { id: 'e1', source: 'admin', target: 'api', label: 'opens dashboard', animated: true },
  { id: 'e2', source: 'api', target: 'cache', label: 'cache hit: instant response', style: { stroke: '#16a34a', strokeWidth: 2 } },
  { id: 'e3', source: 'api', target: 'brinDb', label: 'cache miss: range query', style: { stroke: '#0284c7', strokeWidth: 1.5 } },
];

export const log04Steps = [
  { step: 1, nodeId: 'admin', description: 'Admin requests system activity dashboard.' },
  { step: 2, nodeId: 'cache', description: 'Memory cache returns pre-calculated statistics in under 50 milliseconds.' },
  { step: 3, nodeId: 'brinDb', description: 'Background writes leverage an 18MB compact index, running 11.6x faster than GIN.' },
];

// ========================================================
// 7. LOG-05: LONG-TERM ARCHIVE & AUDITOR VERIFICATION
// Scenario: "Old audit records move to cold storage and an auditor verifies them later"
// ========================================================
export const log05Nodes: Node[] = [
  {
    id: 'archiveJob',
    type: 'logoNode',
    data: {
      logo: 'archive',
      title: 'Archive Job',
      caption: 'reads records > 90 days',
      badge: 'Nightly Cron',
      badgeColor: '#d97706',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'db',
    type: 'logoNode',
    data: {
      logo: 'postgresql',
      title: 'PostgreSQL 16',
      caption: 'streamed safely',
      badge: 'No Memory Spike',
      badgeColor: '#0284c7',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'bundle',
    type: 'infoNode',
    data: {
      badge: '.jsonl.gz BUNDLE',
      title: 'Compressed Stream',
      caption: '85% storage reduction',
      color: '#2563eb',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'r2',
    type: 'logoNode',
    data: {
      logo: 'cloudflare-r2',
      title: 'Cloudflare R2',
      caption: 'locked for 7 years',
      badge: 'WORM Vault',
      badgeColor: '#f97316',
      details: {
        className: 'AuditArchiveBundle.java',
        description: 'Immutable object storage with SHA-256 manifest and zero egress fees.',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'auditor',
    type: 'logoNode',
    data: {
      logo: 'auditor',
      title: 'Compliance Auditor',
      caption: 'verifies fingerprint',
      badge: 'Verified Clean',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
];

export const log05Edges: Edge[] = [
  { id: 'e1', source: 'archiveJob', target: 'db', label: 'reads records > 90 days', animated: true },
  { id: 'e2', source: 'db', target: 'bundle', label: 'streamed safely' },
  { id: 'e3', source: 'bundle', target: 'r2', label: 'uploaded and locked 7 yrs', style: { stroke: '#f97316', strokeWidth: 2 } },
  { id: 'e4', source: 'auditor', target: 'r2', label: 're-checks SHA-256 fingerprint', animated: true, style: { stroke: '#16a34a', strokeDasharray: '4,4' } },
];

export const log05Steps = [
  { step: 1, nodeId: 'archiveJob', description: 'Nightly archive job selects compliance records older than 90 days.' },
  { step: 2, nodeId: 'db', description: 'Database streams records in chunks to prevent server memory bloat.' },
  { step: 3, nodeId: 'bundle', description: 'Data is compressed into .jsonl.gz and sealed with a SHA-256 fingerprint.' },
  { step: 4, nodeId: 'r2', description: 'Archive is stored in Cloudflare R2 under a 7-year tamper-proof WORM lock.' },
  { step: 5, nodeId: 'auditor', description: 'External compliance auditor verifies fingerprint matches untouched original.' },
];

// ========================================================
// 8. RATE-LIMIT TIERS SCENARIO
// Scenario: "Three kinds of visitors hit the API"
// ========================================================
export const rateLimitingNodes: Node[] = [
  {
    id: 'client',
    type: 'logoNode',
    data: {
      logo: 'client-ingress',
      title: 'API Visitors',
      caption: 'every incoming request',
      badge: 'Public Edge',
      badgeColor: '#475569',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'redis',
    type: 'logoNode',
    data: {
      logo: 'redis',
      title: 'Redis 7.2 Cluster',
      caption: 'counts requests per IP',
      badge: 'Bucket4j RAM',
      badgeColor: '#dc2626',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'tier1',
    type: 'infoNode',
    data: {
      badge: '5 / MINUTE',
      title: 'Auth & Login Tier',
      caption: 'blocks credential stuffing',
      color: '#dc2626',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'tier2',
    type: 'infoNode',
    data: {
      badge: '60 / MINUTE',
      title: 'Doctors & Directory',
      caption: 'allows normal browsing',
      color: '#2563eb',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'tier3',
    type: 'infoNode',
    data: {
      badge: '300 / MINUTE',
      title: 'Clinical & Webhooks',
      caption: 'high priority sessions',
      color: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
];

export const rateLimitingEdges: Edge[] = [
  { id: 'e1', source: 'client', target: 'redis', label: 'evaluates IP quota', animated: true },
  { id: 'e2', source: 'redis', target: 'tier1', label: 'auth endpoints', style: { stroke: '#dc2626' } },
  { id: 'e3', source: 'redis', target: 'tier2', label: 'public directory', style: { stroke: '#2563eb' } },
  { id: 'e4', source: 'redis', target: 'tier3', label: 'clinical actions', style: { stroke: '#16a34a' } },
];

export const rateLimitingSteps = [
  { step: 1, nodeId: 'client', description: 'Incoming HTTP requests arrive at the application perimeter.' },
  { step: 2, nodeId: 'redis', description: 'Redis tracks per-IP request timestamps in RAM with sub-millisecond latency.' },
  { step: 3, nodeId: 'tier1', description: 'Strict 5 req/min quota prevents brute force attacks on authentication.' },
  { step: 4, nodeId: 'tier2', description: 'Public doctor directory allows 60 req/min for seamless user browsing.' },
  { step: 5, nodeId: 'tier3', description: 'Authenticated doctor actions and payment webhooks are permitted 300 req/min.' },
];

// ========================================================
// 9. ON-DEMAND EMERGENCY QUEUE
// Scenario: "An emergency patient requests an instant doctor consultation"
// ========================================================
export const onDemandNodes: Node[] = [
  {
    id: 'patient',
    type: 'logoNode',
    data: {
      logo: 'patient',
      title: 'Patient in Crisis',
      caption: 'presses Call Now',
      badge: '15m/30m/45m',
      badgeColor: '#dc2626',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'server',
    type: 'logoNode',
    data: {
      logo: 'spring-boot',
      title: 'Queue Dispatcher',
      caption: 'pairs patient to doctor',
      badge: 'Row Lock',
      badgeColor: '#16a34a',
      details: {
        className: 'WaitingQueueDispatcherScheduler.java',
        description: 'Acquires pessimistic row lock to guarantee zero duplicate dispatch.',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'redisPool',
    type: 'logoNode',
    data: {
      logo: 'redis',
      title: 'Doctor Presence Pool',
      caption: 'active on-duty doctors',
      badge: 'Live Status',
      badgeColor: '#dc2626',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'doctor',
    type: 'logoNode',
    data: {
      logo: 'doctor',
      title: 'Duty Doctor',
      caption: 'rings via instant alert',
      badge: '45s Window',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'livekit',
    type: 'logoNode',
    data: {
      logo: 'livekit',
      title: 'LiveKit SFU',
      caption: 'consultation room opens',
      badge: 'Sub-200ms',
      badgeColor: '#2160fd',
    },
    position: { x: 0, y: 0 },
  },
];

export const onDemandEdges: Edge[] = [
  { id: 'e1', source: 'patient', target: 'server', label: 'presses Call Now', animated: true },
  { id: 'e2', source: 'server', target: 'redisPool', label: 'finds active doctor' },
  { id: 'e3', source: 'redisPool', target: 'doctor', label: 'rings doctor (45s window)', animated: true, style: { stroke: '#16a34a' } },
  { id: 'e4', source: 'doctor', target: 'livekit', label: 'accepted: opens room', style: { stroke: '#2160fd', strokeWidth: 2 } },
];

export const onDemandSteps = [
  { step: 1, nodeId: 'patient', description: 'Patient in crisis selects consultation duration and presses "Call Now".' },
  { step: 2, nodeId: 'server', description: 'Queue dispatcher locks reservation with zero race-condition risk.' },
  { step: 3, nodeId: 'redisPool', description: 'Server retrieves available practitioners from real-time presence pool.' },
  { step: 4, nodeId: 'doctor', description: 'Doctor receives ringing alert with a 45-second acceptance countdown.' },
  { step: 5, nodeId: 'livekit', description: 'When accepted, LiveKit SFU media room initializes with sub-200ms audio/video.' },
];

// ========================================================
// 10. LIVEKIT WEBRTC SERVER INTEGRATION
// Scenario: "Establishing a real-time WebRTC audio/video consultation"
// ========================================================
export const livekitIntegrationNodes: Node[] = [
  {
    id: 'backend',
    type: 'logoNode',
    data: {
      logo: 'spring-boot',
      title: 'HITHA Backend',
      caption: 'creates consultation',
      badge: 'Core Server',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'livekit',
    type: 'logoNode',
    data: {
      logo: 'livekit',
      title: 'LiveKit SFU Server',
      caption: 'generates room token',
      badge: 'Media Cluster',
      badgeColor: '#2160fd',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'patient',
    type: 'logoNode',
    data: {
      logo: 'patient',
      title: 'Patient App',
      caption: 'joins video session',
      badge: 'Mobile Client',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'doctor',
    type: 'logoNode',
    data: {
      logo: 'doctor',
      title: 'Doctor Portal',
      caption: 'joins clinical room',
      badge: 'Desktop / Web',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
];

export const livekitIntegrationEdges: Edge[] = [
  { id: 'e1', source: 'backend', target: 'livekit', label: 'creates room via API', animated: true },
  { id: 'e2', source: 'livekit', target: 'backend', label: 'returns auth token' },
  { id: 'e3', source: 'backend', target: 'patient', label: 'passes patient token', style: { stroke: '#16a34a' } },
  { id: 'e4', source: 'backend', target: 'doctor', label: 'passes doctor token', style: { stroke: '#16a34a' } },
  { id: 'e5', source: 'patient', target: 'livekit', label: 'sub-200ms WebRTC stream', style: { stroke: '#2160fd', strokeWidth: 2 } },
  { id: 'e6', source: 'doctor', target: 'livekit', label: 'sub-200ms WebRTC stream', style: { stroke: '#2160fd', strokeWidth: 2 } },
];

export const livekitIntegrationSteps = [
  { step: 1, nodeId: 'backend', description: 'HITHA backend requests new consultation room from LiveKit server.' },
  { step: 2, nodeId: 'livekit', description: 'LiveKit generates unique participant tokens with dynamic expiration.' },
  { step: 3, nodeId: 'patient', description: 'Patient receives room token and connects audio/video feeds.' },
  { step: 4, nodeId: 'doctor', description: 'Doctor joins session; peer-to-peer media is routed via SFU.' },
];

// ========================================================
// 11. TRANSACTIONAL OUTBOX PATTERN
// Scenario: "Guaranteeing notification delivery without database locking"
// ========================================================
export const outboxNodes: Node[] = [
  {
    id: 'doctor',
    type: 'logoNode',
    data: {
      logo: 'doctor',
      title: 'Doctor Action',
      caption: 'confirms appointment',
      badge: 'Clinical Event',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'db',
    type: 'logoNode',
    data: {
      logo: 'postgresql',
      title: 'PostgreSQL 16',
      caption: 'saves booking and outbox',
      badge: '1 ACID Transaction',
      badgeColor: '#0284c7',
      details: {
        className: 'OutboxEvent.java',
        description: 'Both appointment and outbox event are saved atomically in same transaction.',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'worker',
    type: 'logoNode',
    data: {
      logo: 'spring-boot',
      title: 'Background Poller',
      caption: 'polls pending events',
      badge: 'Lock Protected',
      badgeColor: '#16a34a',
      details: {
        className: 'OutboxPublisherScheduler.java',
        description: 'Uses SKIP LOCKED to safely poll pending records across multiple pods.',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'gateway',
    type: 'infoNode',
    data: {
      badge: 'DISPATCHED',
      title: 'SMS & Email Gateway',
      caption: 'delivers patient message',
      color: '#2160fd',
    },
    position: { x: 0, y: 0 },
  },
];

export const outboxEdges: Edge[] = [
  { id: 'e1', source: 'doctor', target: 'db', label: 'saves booking in 1 transaction', animated: true },
  { id: 'e2', source: 'db', target: 'worker', label: 'polls unpublished records' },
  { id: 'e3', source: 'worker', target: 'gateway', label: 'delivers SMS to patient', style: { stroke: '#2160fd', strokeWidth: 2 } },
];

export const outboxSteps = [
  { step: 1, nodeId: 'doctor', description: 'Doctor confirms clinical consultation slot.' },
  { step: 2, nodeId: 'db', description: 'Booking and outbox record commit together in a single atomic transaction.' },
  { step: 3, nodeId: 'worker', description: 'Background poller reads pending events with zero lock contention.' },
  { step: 4, nodeId: 'gateway', description: 'SMS gateway delivers booking confirmation directly to patient phone.' },
];

// ========================================================
// 12. MULTI-TIER CACHING ARCHITECTURE
// Scenario: "Answering high-frequency queries from cache to protect database"
// ========================================================
export const cachingNodes: Node[] = [
  {
    id: 'client',
    type: 'logoNode',
    data: {
      logo: 'client-ingress',
      title: 'Patient App',
      caption: 'queries doctor slots',
      badge: 'HTTP Request',
      badgeColor: '#475569',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'caffeine',
    type: 'infoNode',
    data: {
      badge: 'L1 CACHE (RAM)',
      title: 'In-Memory Cache',
      caption: 'answered in microsecond',
      color: '#16a34a',
      details: {
        className: 'CaffeineCacheConfig.java',
        description: 'Local JVM cache with 5-second TTL for peak burst absorption.',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'redis',
    type: 'logoNode',
    data: {
      logo: 'redis',
      title: 'Redis 7.2 Cluster',
      caption: 'L2 distributed cache',
      badge: 'Sub-ms Read',
      badgeColor: '#dc2626',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'db',
    type: 'logoNode',
    data: {
      logo: 'postgresql',
      title: 'PostgreSQL 16',
      caption: 'primary database',
      badge: 'Connection Shield',
      badgeColor: '#0284c7',
    },
    position: { x: 0, y: 0 },
  },
];

export const cachingEdges: Edge[] = [
  { id: 'e1', source: 'client', target: 'caffeine', label: '1: checks memory cache', animated: true },
  { id: 'e2', source: 'caffeine', target: 'redis', label: 'cache miss: checks Redis', style: { stroke: '#dc2626' } },
  { id: 'e3', source: 'redis', target: 'db', label: 'cache miss: queries DB', style: { stroke: '#0284c7' } },
];

export const cachingSteps = [
  { step: 1, nodeId: 'client', description: 'Patient requests available doctor consultation slots.' },
  { step: 2, nodeId: 'caffeine', description: 'In-memory cache responds in microseconds without network overhead.' },
  { step: 3, nodeId: 'redis', description: 'If expired in RAM, distributed Redis cluster provides sub-millisecond lookup.' },
  { step: 4, nodeId: 'db', description: 'Primary PostgreSQL database is queried only on cold cache misses.' },
];

// ========================================================
// 13. DATABASE INDEXING OPTIMIZATION
// Scenario: "Searching 10 million audit records in under 5 milliseconds"
// ========================================================
export const indexingNodes: Node[] = [
  {
    id: 'auditor',
    type: 'logoNode',
    data: {
      logo: 'auditor',
      title: 'Auditor Search',
      caption: 'selects date range',
      badge: 'Time Query',
      badgeColor: '#00a8b5',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'brin',
    type: 'infoNode',
    data: {
      badge: '18 MB FOOTPRINT',
      title: 'BRIN Range Index',
      caption: '99.8% smaller than GIN',
      color: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'buffer',
    type: 'logoNode',
    data: {
      logo: 'postgresql',
      title: 'PostgreSQL Buffer',
      caption: 'pages cached in RAM',
      badge: 'Zero Disk IO',
      badgeColor: '#0284c7',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'result',
    type: 'infoNode',
    data: {
      badge: 'SUB-5ms SCAN',
      title: 'Compliance Records',
      caption: '2,800 writes / sec',
      color: '#2160fd',
    },
    position: { x: 0, y: 0 },
  },
];

export const indexingEdges: Edge[] = [
  { id: 'e1', source: 'auditor', target: 'brin', label: 'checks range boundaries', animated: true },
  { id: 'e2', source: 'brin', target: 'buffer', label: 'loads matching pages' },
  { id: 'e3', source: 'buffer', target: 'result', label: 'returns compliance records', style: { stroke: '#2160fd', strokeWidth: 2 } },
];

export const indexingSteps = [
  { step: 1, nodeId: 'auditor', description: 'Auditor searches for transactions within a 30-day time window.' },
  { step: 2, nodeId: 'brin', description: '18MB BRIN index inspects block range headers instead of scanning full table.' },
  { step: 3, nodeId: 'buffer', description: 'Matching pages load directly from RAM cache with zero random disk seeks.' },
  { step: 4, nodeId: 'result', description: 'Scan finishes in under 5 milliseconds across 10 million audit rows.' },
];

// ========================================================
// 14. DISTRIBUTED BACKGROUND SCHEDULERS
// Scenario: "Running automated maintenance tasks across clustered nodes"
// ========================================================
export const schedulersNodes: Node[] = [
  {
    id: 'leader',
    type: 'logoNode',
    data: {
      logo: 'spring-boot',
      title: 'Scheduler Node',
      caption: 'triggers automated cron',
      badge: 'Leader Election',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'mutex',
    type: 'infoNode',
    data: {
      badge: 'CLUSTER MUTEX',
      title: 'Distributed Lock Table',
      caption: 'prevents duplicate execution',
      color: '#00a8b5',
      details: {
        className: 'ShedLockConfiguration.java',
        description: 'Coordinates execution across multi-pod cluster using database lock table.',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'worker',
    type: 'infoNode',
    data: {
      badge: 'VIRTUAL THREADS',
      title: 'Worker Engine',
      caption: 'non-blocking background task',
      color: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'r2',
    type: 'logoNode',
    data: {
      logo: 'cloudflare-r2',
      title: 'Cloudflare R2',
      caption: 'cold archive and cleanup',
      badge: 'Job Complete',
      badgeColor: '#f97316',
    },
    position: { x: 0, y: 0 },
  },
];

export const schedulersEdges: Edge[] = [
  { id: 'e1', source: 'leader', target: 'mutex', label: 'acquires cluster lock', animated: true },
  { id: 'e2', source: 'mutex', target: 'worker', label: 'spawns worker thread', style: { stroke: '#16a34a' } },
  { id: 'e3', source: 'worker', target: 'r2', label: 'streams archive bundle', style: { stroke: '#f97316', strokeWidth: 2 } },
];

export const schedulersSteps = [
  { step: 1, nodeId: 'leader', description: 'Leader node triggers scheduled maintenance job.' },
  { step: 2, nodeId: 'mutex', description: 'Distributed lock ensures only one server node executes the task.' },
  { step: 3, nodeId: 'worker', description: 'Java 21 virtual thread handles data compression without blocking system.' },
  { step: 4, nodeId: 'r2', description: 'Archived records are uploaded and lock is released for next run.' },
];

// ========================================================
// 15. PRESCRIPTIONS CATALOG & ZERO-PHI
// Scenario: "Issuing a digital prescription with zero sensitive health data in logs"
// ========================================================
export const prescriptionsCatalogNodes: Node[] = [
  {
    id: 'doctor',
    type: 'logoNode',
    data: {
      logo: 'doctor',
      title: 'Doctor Portal',
      caption: 'active video consultation',
      badge: 'Clinical Session',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'catalog',
    type: 'infoNode',
    data: {
      badge: 'NMRA FORMULARY',
      title: 'Prescription Builder',
      caption: 'approved dosage and routes',
      color: '#00a8b5',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'masker',
    type: 'infoNode',
    data: {
      badge: 'ZERO-PHI MASKING',
      title: 'Identity Masker',
      caption: 'removes patient name and ID',
      color: '#dc2626',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'vault',
    type: 'logoNode',
    data: {
      logo: 'postgresql',
      title: 'PostgreSQL Vault',
      caption: 'encrypted clinical record',
      badge: 'Encrypted',
      badgeColor: '#0284c7',
    },
    position: { x: 0, y: 0 },
  },
];

export const prescriptionsCatalogEdges: Edge[] = [
  { id: 'e1', source: 'doctor', target: 'catalog', label: 'selects approved medicine', animated: true },
  { id: 'e2', source: 'catalog', target: 'masker', label: 'sanitizes patient details', style: { stroke: '#dc2626' } },
  { id: 'e3', source: 'masker', target: 'vault', label: 'commits encrypted record', style: { stroke: '#0284c7', strokeWidth: 2 } },
];

export const prescriptionsCatalogSteps = [
  { step: 1, nodeId: 'doctor', description: 'Doctor prescribes medication during live consultation.' },
  { step: 2, nodeId: 'catalog', description: 'Prescription builder validates dosages and drug interaction safety.' },
  { step: 3, nodeId: 'masker', description: 'Zero-PHI filter strips patient name and national identity before logging.' },
  { step: 4, nodeId: 'vault', description: 'Encrypted prescription commits to secure clinical database vault.' },
];

// ========================================================
// 16. RBAC & SUPER ADMIN GOVERNANCE
// Scenario: "Enforcing role hierarchy and pseudonymous user identity"
// ========================================================
export const rbacNodes: Node[] = [
  {
    id: 'user',
    type: 'logoNode',
    data: {
      logo: 'patient',
      title: 'User Registration',
      caption: 'phone + OTP authentication',
      badge: 'Registration',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'security',
    type: 'logoNode',
    data: {
      logo: 'spring-boot',
      title: 'Spring Security 6',
      caption: 'evaluates role hierarchy',
      badge: 'RBAC Gate',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'hierarchy',
    type: 'infoNode',
    data: {
      badge: 'TIER STRUCTURE',
      title: 'Super Admin > Doctor > User',
      caption: 'least privilege access rules',
      color: '#00a8b5',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'pseudonym',
    type: 'infoNode',
    data: {
      badge: 'PRIVACY SHIELD',
      title: 'Pseudonymous Identity',
      caption: 'zero patient name in logs',
      color: '#dc2626',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'db',
    type: 'logoNode',
    data: {
      logo: 'postgresql',
      title: 'PostgreSQL 16',
      caption: 'encrypted credential vault',
      badge: 'Argon2id Hash',
      badgeColor: '#0284c7',
    },
    position: { x: 0, y: 0 },
  },
];

export const rbacEdges: Edge[] = [
  { id: 'e1', source: 'user', target: 'security', label: 'registers account', animated: true },
  { id: 'e2', source: 'security', target: 'hierarchy', label: 'assigns least privilege' },
  { id: 'e3', source: 'hierarchy', target: 'pseudonym', label: 'generates masked identity', style: { stroke: '#dc2626' } },
  { id: 'e4', source: 'pseudonym', target: 'db', label: 'stores encrypted profile', style: { stroke: '#0284c7', strokeWidth: 2 } },
];

export const rbacSteps = [
  { step: 1, nodeId: 'user', description: 'User submits phone verification and credentials.' },
  { step: 2, nodeId: 'security', description: 'Spring Security evaluates role boundaries and permission sets.' },
  { step: 3, nodeId: 'hierarchy', description: 'Enforces strict separation between Super Admin, Doctor, and Patient.' },
  { step: 4, nodeId: 'pseudonym', description: 'Generates pseudonymous identifier to protect patient social privacy.' },
  { step: 5, nodeId: 'db', description: 'Stores user credentials using high-security Argon2id hashing.' },
];

// ========================================================
// 17. SSE REAL-TIME TOKEN REFRESH
// Scenario: "Maintaining live updates and refreshing tokens without dropouts"
// ========================================================
export const sseRefreshNodes: Node[] = [
  {
    id: 'client',
    type: 'logoNode',
    data: {
      logo: 'client-ingress',
      title: 'Client Device',
      caption: 'opens live event stream',
      badge: 'EventSource',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'sse',
    type: 'logoNode',
    data: {
      logo: 'spring-boot',
      title: 'Spring SSE Stream',
      caption: 'persistent HTTP channel',
      badge: 'Sub-20ms Ring',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'refresher',
    type: 'infoNode',
    data: {
      badge: 'SLIDING 15m TTL',
      title: 'Token Auto-Refresh',
      caption: 'renews token before expiry',
      color: '#2563eb',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'redis',
    type: 'logoNode',
    data: {
      logo: 'redis',
      title: 'Redis Presence',
      caption: 'presence heartbeat check',
      badge: '30s Keep-Alive',
      badgeColor: '#dc2626',
    },
    position: { x: 0, y: 0 },
  },
];

export const sseRefreshEdges: Edge[] = [
  { id: 'e1', source: 'client', target: 'sse', label: 'opens live event stream', animated: true },
  { id: 'e2', source: 'sse', target: 'refresher', label: 'renews token silently' },
  { id: 'e3', source: 'sse', target: 'redis', label: 'publishes 30s heartbeat', style: { stroke: '#dc2626', strokeWidth: 2 } },
];

export const sseRefreshSteps = [
  { step: 1, nodeId: 'client', description: 'Client opens long-lived HTTP Server-Sent Events stream.' },
  { step: 2, nodeId: 'sse', description: 'Server sends lightweight 15-second heartbeat to maintain open connection.' },
  { step: 3, nodeId: 'refresher', description: 'Access token auto-renews in background without dropping active call.' },
  { step: 4, nodeId: 'redis', description: 'Doctor availability and presence status synchronize in Redis.' },
];

// ========================================================
// 18. SUBSCRIPTION PLANS & IN-CALL DURATIONS
// Scenario: "Validating plan entitlements and extending in-call durations"
// ========================================================
export const subscriptionPlansNodes: Node[] = [
  {
    id: 'patient',
    type: 'logoNode',
    data: {
      logo: 'patient',
      title: 'Patient Ingress',
      caption: 'selects plan tier',
      badge: 'Plan Selector',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'planCheck',
    type: 'infoNode',
    data: {
      badge: 'QUOTA CHECK',
      title: 'Plan Validator',
      caption: 'Individual or Family Care',
      color: '#0284c7',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'room',
    type: 'logoNode',
    data: {
      logo: 'livekit',
      title: 'LiveKit SFU',
      caption: '15m / 30m / 45m session',
      badge: 'Timed Room',
      badgeColor: '#2160fd',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'extension',
    type: 'infoNode',
    data: {
      badge: 'DYNAMIC EXTENSION',
      title: 'In-Call Top-Up',
      caption: '+15m doctor extension',
      color: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
];

export const subscriptionPlansEdges: Edge[] = [
  { id: 'e1', source: 'patient', target: 'planCheck', label: 'selects consultation plan', animated: true },
  { id: 'e2', source: 'planCheck', target: 'room', label: 'initiates timed room', style: { stroke: '#2160fd', strokeWidth: 2 } },
  { id: 'e3', source: 'room', target: 'extension', label: 'warning at 2 min: requests top-up', style: { stroke: '#16a34a', strokeDasharray: '4,4' } },
];

export const subscriptionPlansSteps = [
  { step: 1, nodeId: 'patient', description: 'Patient selects consultation plan (Individual, Family, or Emergency).' },
  { step: 2, nodeId: 'planCheck', description: 'System validates active monthly entitlement without billing delay.' },
  { step: 3, nodeId: 'room', description: 'LiveKit SFU initializes room with configured 15m, 30m, or 45m countdown.' },
  { step: 4, nodeId: 'extension', description: 'When 2 minutes remain, patient can request a 15-minute top-up.' },
];

// ========================================================
// 19. DOCTOR WALLET & ESCROW SETTLEMENT
// Scenario: "Holding consultation fees in escrow until doctor sign-off"
// ========================================================
export const escrowNodes: Node[] = [
  {
    id: 'payment',
    type: 'logoNode',
    data: {
      logo: 'payhere',
      title: 'Patient Payment',
      caption: 'LKR 4,500 consultation fee',
      badge: 'Settled',
      badgeColor: '#0284c7',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'escrow',
    type: 'infoNode',
    data: {
      badge: 'CUSTODIAL VAULT',
      title: 'Escrow Vault (HOLD)',
      caption: 'funds locked during call',
      color: '#d97706',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'signoff',
    type: 'logoNode',
    data: {
      logo: 'doctor',
      title: 'Doctor Sign-off',
      caption: 'clinical session complete',
      badge: 'Call Ended',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'doctorWallet',
    type: 'infoNode',
    data: {
      badge: '85% ALLOCATION',
      title: 'Doctor Wallet (LKR 3,825)',
      caption: 'ready for bank withdrawal',
      color: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'platformFee',
    type: 'infoNode',
    data: {
      badge: '15% ALLOCATION',
      title: 'HITHA Platform (LKR 675)',
      caption: 'infrastructure fee',
      color: '#2160fd',
    },
    position: { x: 0, y: 0 },
  },
];

export const escrowEdges: Edge[] = [
  { id: 'e1', source: 'payment', target: 'escrow', label: 'locks fee in escrow', animated: true, style: { stroke: '#d97706', strokeWidth: 2 } },
  { id: 'e2', source: 'escrow', target: 'signoff', label: 'awaits doctor sign-off' },
  { id: 'e3', source: 'signoff', target: 'doctorWallet', label: 'credits 85% to doctor', animated: true, style: { stroke: '#16a34a', strokeWidth: 2 } },
  { id: 'e4', source: 'signoff', target: 'platformFee', label: 'credits 15% platform split', animated: true, style: { stroke: '#2160fd', strokeWidth: 2 } },
];

export const escrowSteps = [
  { step: 1, nodeId: 'payment', description: 'Patient pays consultation fee prior to video call.' },
  { step: 2, nodeId: 'escrow', description: 'Full fee is held in custodial escrow while the doctor is consulting.' },
  { step: 3, nodeId: 'signoff', description: 'Doctor marks session completed and submits clinical diagnosis notes.' },
  { step: 4, nodeId: 'doctorWallet', description: '85% is instantly credited to doctor withdrawable wallet.' },
  { step: 5, nodeId: 'platformFee', description: '15% platform operational split is recorded in double-entry ledger.' },
];
