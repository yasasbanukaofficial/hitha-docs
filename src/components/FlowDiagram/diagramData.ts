import { Node, Edge } from '@xyflow/react';

// ========================================================
// 1. RATE LIMITING DIAGRAM DATA (Part 3 Reference)
// ========================================================
export const rateLimitingNodes: Node[] = [
  {
    id: 'ingress',
    type: 'logoNode',
    data: {
      logo: 'client-ingress',
      title: 'Client Ingress',
      caption: 'X-Forwarded-For IP',
      details: {
        className: 'RateLimitingFilter.java',
        description: 'Extracts real client IP from X-Forwarded-For and evaluates token bucket quotas.',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'redis',
    type: 'logoNode',
    data: {
      logo: 'redis',
      title: 'Redis',
      caption: 'atomic token replenishment',
      badge: 'Bucket4j',
      badgeColor: '#0284c7',
      details: {
        className: 'RedisTokenBucketService.java',
        description: 'Synchronized in-memory sliding window token bucket with sub-millisecond atomic decrement.',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'tier1',
    type: 'infoNode',
    data: {
      badge: 'Tier 1 (Strict)',
      title: 'Auth & OTP',
      caption: '5 req / min',
      color: '#dc2626',
      details: {
        className: 'AuthRateLimitConfig.java',
        description: 'Blocks credential stuffing and OTP flooding attacks across /api/v1/auth/login and verify-otp.',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'tier2',
    type: 'infoNode',
    data: {
      badge: 'Tier 2 (Public)',
      title: 'Doctors & Slots',
      caption: '60 req / min',
      color: '#2563eb',
      details: {
        className: 'PublicRateLimitConfig.java',
        description: 'Allows legitimate browsing while throttling automated scrapers on directory queries.',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'tier3',
    type: 'infoNode',
    data: {
      badge: 'Tier 3 (Auth)',
      title: 'Clinical & Webhooks',
      caption: '300 req / min',
      color: '#16a34a',
      details: {
        className: 'DoctorRateLimitConfig.java',
        description: 'High-throughput authenticated doctor actions and PayHere gateway webhook processing.',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'rejected',
    type: 'infoNode',
    data: {
      badge: 'QUOTA EXCEEDED',
      title: 'HTTP 429',
      caption: 'Too Many Requests',
      color: '#b91c1c',
      details: {
        className: 'RateLimitExceptionHandler.java',
        description: 'Returns HTTP 429 with Retry-After header without touching database or consuming connection pool.',
      },
    },
    position: { x: 0, y: 0 },
  },
];

export const rateLimitingEdges: Edge[] = [
  {
    id: 'e-ingress-redis',
    source: 'ingress',
    target: 'redis',
    label: 'every request',
    animated: true,
    style: { stroke: '#2160fd', strokeWidth: 2 },
  },
  {
    id: 'e-redis-t1',
    source: 'redis',
    target: 'tier1',
    label: '5 req/min',
    style: { stroke: '#dc2626', strokeWidth: 2 },
  },
  {
    id: 'e-redis-t2',
    source: 'redis',
    target: 'tier2',
    label: '60 req/min',
    style: { stroke: '#2563eb', strokeWidth: 2 },
  },
  {
    id: 'e-redis-t3',
    source: 'redis',
    target: 'tier3',
    label: '300 req/min',
    style: { stroke: '#16a34a', strokeWidth: 2 },
  },
  {
    id: 'e-t1-reject',
    source: 'tier1',
    target: 'rejected',
    label: 'limit hit',
    style: { stroke: '#dc2626', strokeDasharray: '4,4', strokeWidth: 1.5 },
  },
];

export const rateLimitingSteps = [
  { step: 1, nodeId: 'ingress', edgeId: 'e-ingress-redis', description: 'Client initiates request with IP header' },
  { step: 2, nodeId: 'redis', description: 'Redis & Bucket4j checks available token capacity' },
  { step: 3, nodeId: 'tier1', edgeId: 'e-redis-t1', description: 'Auth endpoints limited strictly to 5 req/min' },
  { step: 4, nodeId: 'tier2', edgeId: 'e-redis-t2', description: 'Directory search permitted up to 60 req/min' },
  { step: 5, nodeId: 'tier3', edgeId: 'e-redis-t3', description: 'Authenticated clinical actions permitted up to 300 req/min' },
];

// ========================================================
// 2. HERO: DUAL-PLANE OVERVIEW DIAGRAM DATA
// ========================================================
export const dualPlaneHeroNodes: Node[] = [
  {
    id: 'http',
    type: 'logoNode',
    data: {
      logo: 'spring-boot',
      title: 'Spring Boot 3.3',
      caption: 'HTTP Ingress',
      details: {
        className: 'SpringDispatcherServlet',
        description: 'Java 21 Virtual Thread runtime receiving clinical and operational requests.',
      },
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'filter',
    type: 'infoNode',
    data: {
      badge: 'Filter',
      title: 'CorrelationIdFilter',
      caption: '5 MDC Dimensions',
      color: '#00a8b5',
      details: {
        className: 'CorrelationIdFilter.java',
        description: 'Tags thread with correlationId, actorId, actorRole, clientIp, and jurisdiction.',
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
      caption: 'Plane A: Operational Logs',
      details: {
        className: 'logback-spring.xml',
        description: 'Non-blocking AsyncAppender with 8,192 ring buffer writing to local ephemeral disk.',
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
      caption: 'Plane B: Audit Trail',
      details: {
        className: 'AuditLogServiceImpl.java',
        description: 'SHA-256 Hash-chained tamper-evident legal records with BRIN indexing.',
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
      caption: '7-Year WORM Storage',
      details: {
        className: 'AuditLogArchiveServiceImpl.java',
        description: 'Cold export of >90-day records in .jsonl.gz with cryptographic SHA-256 manifests.',
      },
    },
    position: { x: 0, y: 0 },
  },
];

export const dualPlaneHeroEdges: Edge[] = [
  {
    id: 'e-http-filter',
    source: 'http',
    target: 'filter',
    animated: true,
    style: { stroke: '#64748b', strokeWidth: 2 },
  },
  {
    id: 'e-filter-planeA',
    source: 'filter',
    target: 'planeA',
    label: 'debug & operational logs',
    style: { stroke: '#2563eb', strokeWidth: 2 },
  },
  {
    id: 'e-filter-planeB',
    source: 'filter',
    target: 'planeB',
    label: 'legal compliance audits',
    style: { stroke: '#8b5cf6', strokeWidth: 2 },
  },
  {
    id: 'e-planeB-r2',
    source: 'planeB',
    target: 'r2',
    label: '90+ days archival',
    animated: true,
    style: { stroke: '#ea580c', strokeWidth: 2 },
  },
];

export const dualPlaneHeroSteps = [
  { step: 1, nodeId: 'http', edgeId: 'e-http-filter', description: 'Request arrives at Spring Boot HTTP gateway' },
  { step: 2, nodeId: 'filter', description: 'CorrelationIdFilter attaches 5 MDC diagnostic dimensions' },
  { step: 3, nodeId: 'planeA', edgeId: 'e-filter-planeA', description: 'High-frequency logs stream to Plane A local disk' },
  { step: 4, nodeId: 'planeB', edgeId: 'e-filter-planeB', description: 'Legal compliance records saved to Plane B PostgreSQL' },
  { step: 5, nodeId: 'r2', edgeId: 'e-planeB-r2', description: 'Records older than 90 days exported to Cloudflare R2' },
];

export const heroNodes = dualPlaneHeroNodes;
export const heroEdges = dualPlaneHeroEdges;
export const heroSteps = dualPlaneHeroSteps;

// ========================================================
// 3. LOG-01: ASYNC LOGBACK PIPELINE
// ========================================================
export const log01Nodes: Node[] = [
  {
    id: 'httpReq',
    type: 'logoNode',
    data: {
      logo: 'spring-boot',
      title: 'HTTP Request',
      caption: 'Spring Boot 3.3',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'mdcInfo',
    type: 'infoNode',
    data: {
      badge: '5 MDC Dimensions',
      title: 'CorrelationIdFilter',
      caption: 'correlationId · actorId · role · IP · jurisdiction',
      color: '#00a8b5',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'logger',
    type: 'logoNode',
    data: {
      logo: 'logback',
      title: 'SLF4J Logger',
      caption: 'Non-blocking call',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'ringBuffer',
    type: 'infoNode',
    data: {
      badge: 'Ring Buffer',
      title: 'AsyncAppender',
      caption: '8,192 event capacity',
      color: '#2563eb',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'diskNode',
    type: 'infoNode',
    data: {
      badge: 'Storage Policy',
      title: 'Rolling GZIP Disk',
      caption: '100MB/1h rot · 5GB cap · 14d evict',
      color: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'responseSent',
    type: 'infoNode',
    data: {
      badge: 'Non-Blocking',
      title: 'Response Sent',
      caption: 'Thread returns in < 1ms',
      color: '#0284c7',
    },
    position: { x: 0, y: 0 },
  },
];

export const log01Edges: Edge[] = [
  { id: 'e1', source: 'httpReq', target: 'mdcInfo', animated: true },
  { id: 'e2', source: 'mdcInfo', target: 'logger', animated: true },
  { id: 'e3', source: 'logger', target: 'ringBuffer', label: 'async enqueue', style: { stroke: '#2563eb', strokeWidth: 2 } },
  { id: 'e4', source: 'ringBuffer', target: 'diskNode', label: 'background write', style: { stroke: '#16a34a', strokeWidth: 2 } },
  { id: 'e5', source: 'logger', target: 'responseSent', label: 'returns immediately', style: { stroke: '#0284c7', strokeDasharray: '4,4', strokeWidth: 1.5 } },
];

export const log01Steps = [
  { step: 1, nodeId: 'httpReq', edgeId: 'e1', description: 'HTTP request enters Spring Boot gateway' },
  { step: 2, nodeId: 'mdcInfo', edgeId: 'e2', description: 'Correlation filter enriches execution context' },
  { step: 3, nodeId: 'logger', edgeId: 'e3', description: 'Logger pushes event to AsyncAppender ring buffer' },
  { step: 4, nodeId: 'responseSent', edgeId: 'e5', description: 'Request thread returns immediately without waiting for disk' },
  { step: 5, nodeId: 'diskNode', edgeId: 'e4', description: 'Background thread flushes to rolling GZIP files' },
];

// ========================================================
// 4. LOG-02: HASH CHAIN CONCURRENCY
// ========================================================
export const log02Nodes: Node[] = [
  {
    id: 'threads',
    type: 'logoNode',
    data: {
      logo: 'java',
      title: '20 Virtual Threads',
      caption: 'Concurrent audit bursts',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'lock',
    type: 'infoNode',
    data: {
      badge: 'JVM Lock',
      title: 'ReentrantLock',
      caption: 'hashChainLock.lock()',
      color: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'criticalSection',
    type: 'infoNode',
    data: {
      badge: 'Critical Section',
      title: 'findLatest → compute → save',
      caption: 'Atomic chain calculation',
      color: '#2160fd',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'dbChain',
    type: 'logoNode',
    data: {
      logo: 'postgresql',
      title: 'Linear Hash Chain',
      caption: 'Block N-1 → N → N+1 (0 Forks)',
    },
    position: { x: 0, y: 0 },
  },
];

export const log02Edges: Edge[] = [
  { id: 'e1', source: 'threads', target: 'lock', label: 'acquire lock', animated: true },
  { id: 'e2', source: 'lock', target: 'criticalSection', label: 'single thread entry', style: { stroke: '#16a34a', strokeWidth: 2 } },
  { id: 'e3', source: 'criticalSection', target: 'dbChain', label: 'verified sequence', style: { stroke: '#2160fd', strokeWidth: 2 } },
];

// ========================================================
// 5. LOG-03: HIKARICP POOL PROTECTION
// ========================================================
export const log03Nodes: Node[] = [
  {
    id: 'attack',
    type: 'infoNode',
    data: {
      badge: 'Threat Flood',
      title: 'Unauthenticated 401s',
      caption: 'Volumetric credential brute-force',
      color: '#dc2626',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'entryPoint',
    type: 'infoNode',
    data: {
      badge: 'Auth Entry Point',
      title: 'AuditAuthEntryPoint',
      caption: 'Sliding window per IP',
      color: '#00a8b5',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'decision',
    type: 'decisionNode',
    data: {
      label: '≤ 5 / min?',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'pool',
    type: 'infoNode',
    data: {
      badge: 'HikariCP Pool',
      title: '8 Database Connections',
      caption: 'Protected from exhaustion',
      color: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'planeADivert',
    type: 'infoNode',
    data: {
      badge: 'Plane A Divert',
      title: 'Local Log File Only',
      caption: 'Zero JDBC connections acquired',
      color: '#ea580c',
    },
    position: { x: 0, y: 0 },
  },
];

export const log03Edges: Edge[] = [
  { id: 'e1', source: 'attack', target: 'entryPoint', animated: true, style: { stroke: '#dc2626', strokeWidth: 2 } },
  { id: 'e2', source: 'entryPoint', target: 'decision' },
  { id: 'e3', source: 'decision', target: 'pool', label: 'YES (normal)', style: { stroke: '#16a34a', strokeWidth: 2 } },
  { id: 'e4', source: 'decision', target: 'planeADivert', label: 'NO (flood)', style: { stroke: '#dc2626', strokeWidth: 2 } },
];

// ========================================================
// 6. LOG-04: POSTGRESQL BRIN INDEX & STATS CACHE
// ========================================================
export const log04Nodes: Node[] = [
  {
    id: 'adminDash',
    type: 'infoNode',
    data: {
      badge: 'Dashboard',
      title: 'Admin Activity UI',
      caption: 'High-frequency metric polls',
      color: '#2160fd',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'cacheDecision',
    type: 'decisionNode',
    data: {
      label: 'Cache Hit? (60s TTL)',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'instantReturn',
    type: 'infoNode',
    data: {
      badge: 'Fast Return',
      title: '< 50ms Response',
      caption: 'Served directly from RAM',
      color: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'brinDb',
    type: 'logoNode',
    data: {
      logo: 'postgresql',
      title: 'PostgreSQL 16',
      caption: 'BRIN Index (18MB vs 12GB GIN)',
      badge: '11.6x faster',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
];

export const log04Edges: Edge[] = [
  { id: 'e1', source: 'adminDash', target: 'cacheDecision', animated: true },
  { id: 'e2', source: 'cacheDecision', target: 'instantReturn', label: 'HIT (RAM)', style: { stroke: '#16a34a', strokeWidth: 2 } },
  { id: 'e3', source: 'cacheDecision', target: 'brinDb', label: 'MISS (Query)', style: { stroke: '#d97706', strokeWidth: 2 } },
];

// ========================================================
// 7. LOG-05: CLOUDFLARE R2 COLD ARCHIVAL
// ========================================================
export const log05Nodes: Node[] = [
  {
    id: 'hotDb',
    type: 'logoNode',
    data: {
      logo: 'postgresql',
      title: 'Hot DB (> 90 Days)',
      caption: 'Records ready for cold export',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'archiver',
    type: 'infoNode',
    data: {
      badge: 'Stream Archiver',
      title: 'AuditLogArchiveService',
      caption: 'Memory-safe streaming chunker',
      color: '#00a8b5',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'bundle',
    type: 'infoNode',
    data: {
      badge: 'Compressed Data',
      title: '.jsonl.gz Bundle',
      caption: '85% GZIP compression',
      color: '#2563eb',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'manifest',
    type: 'infoNode',
    data: {
      badge: 'Integrity Seal',
      title: 'SHA-256 Manifest',
      caption: 'Tamper-proof digital fingerprint',
      color: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'r2Bucket',
    type: 'logoNode',
    data: {
      logo: 'cloudflare-r2',
      title: 'Cloudflare R2',
      caption: 'WORM · 7-year lock',
    },
    position: { x: 0, y: 0 },
  },
];

export const log05Edges: Edge[] = [
  { id: 'e1', source: 'hotDb', target: 'archiver', animated: true },
  { id: 'e2', source: 'archiver', target: 'bundle', label: 'compress' },
  { id: 'e3', source: 'archiver', target: 'manifest', label: 'compute SHA-256' },
  { id: 'e4', source: 'bundle', target: 'r2Bucket', label: 'upload', style: { stroke: '#ea580c', strokeWidth: 2 } },
  { id: 'e5', source: 'r2Bucket', target: 'manifest', label: 'integrity check', style: { stroke: '#64748b', strokeDasharray: '4,4' } },
];

// ========================================================
// 8. TRANSACTIONAL OUTBOX PATTERN
// ========================================================
export const outboxNodes: Node[] = [
  {
    id: 'springCore',
    type: 'logoNode',
    data: {
      logo: 'spring-boot',
      title: 'Spring Boot 3.3',
      caption: 'Business Service Mutation',
      badge: 'Core Service',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'postgresAcid',
    type: 'logoNode',
    data: {
      logo: 'postgresql',
      title: 'PostgreSQL 16',
      caption: '1 ACID Transaction (Entity + outbox_events)',
      badge: 'Zero Loss',
      badgeColor: '#0284c7',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'shedlockWorker',
    type: 'infoNode',
    data: {
      badge: 'ShedLock Worker',
      title: 'OutboxPollerService',
      caption: 'Virtual thread batch publisher',
      color: '#00a8b5',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'externalBroker',
    type: 'logoNode',
    data: {
      logo: 'client-ingress',
      title: 'External Broker',
      caption: 'Webhook / Kafka / Notification',
      badge: 'Dispatched',
      badgeColor: '#2160fd',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'dlqNode',
    type: 'infoNode',
    data: {
      badge: 'MAX RETRIES (5)',
      title: 'outbox_dlq',
      caption: 'Dead letter quarantine with alerts',
      color: '#dc2626',
    },
    position: { x: 0, y: 0 },
  },
];

export const outboxEdges: Edge[] = [
  { id: 'e1', source: 'springCore', target: 'postgresAcid', label: 'Atomic COMMIT', animated: true, style: { stroke: '#16a34a', strokeWidth: 2 } },
  { id: 'e2', source: 'postgresAcid', target: 'shedlockWorker', label: 'SELECT FOR UPDATE SKIP LOCKED', animated: true, style: { stroke: '#0284c7', strokeWidth: 2 } },
  { id: 'e3', source: 'shedlockWorker', target: 'externalBroker', label: 'Deliver Event', style: { stroke: '#2160fd', strokeWidth: 2 } },
  { id: 'e4', source: 'shedlockWorker', target: 'dlqNode', label: 'On Exhaustion', style: { stroke: '#dc2626', strokeDasharray: '4,4' } },
];

export const outboxSteps = [
  { step: 1, nodeId: 'springCore', description: 'Business service creates appointment or records diagnosis.' },
  { step: 2, nodeId: 'postgresAcid', description: 'Entity and outbox_events record are written inside a single PostgreSQL ACID transaction.' },
  { step: 3, nodeId: 'shedlockWorker', description: 'Background ShedLock worker polls unpublished events with SKIP LOCKED to prevent duplicate processing.' },
  { step: 4, nodeId: 'externalBroker', description: 'Event payload is dispatched to SMS gateway, payment webhooks, or notification engine.' },
];

// ========================================================
// 9. CACHING ARCHITECTURE (L1 Caffeine + L2 Redis)
// ========================================================
export const cachingNodes: Node[] = [
  {
    id: 'ingress',
    type: 'logoNode',
    data: {
      logo: 'client-ingress',
      title: 'Client Ingress',
      caption: 'Consultation & Doctor Queries',
      badge: 'API Request',
      badgeColor: '#475569',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'caffeineL1',
    type: 'infoNode',
    data: {
      badge: 'L1 Cache (JVM)',
      title: 'Caffeine Cache',
      caption: 'Sub-microsecond heap lookup (5s TTL)',
      color: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'redisL2',
    type: 'logoNode',
    data: {
      logo: 'redis',
      title: 'Redis 7.2 Cluster',
      caption: 'L2 Distributed Cache (Redisson Mutex)',
      badge: 'Sub-ms RAM',
      badgeColor: '#dc2626',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'dbMaster',
    type: 'logoNode',
    data: {
      logo: 'postgresql',
      title: 'PostgreSQL 16',
      caption: 'Master DB with Connection Pool Shield',
      badge: 'Persistent',
      badgeColor: '#0284c7',
    },
    position: { x: 0, y: 0 },
  },
];

export const cachingEdges: Edge[] = [
  { id: 'e1', source: 'ingress', target: 'caffeineL1', label: 'Step 1: L1 Check', animated: true },
  { id: 'e2', source: 'caffeineL1', target: 'redisL2', label: 'L1 MISS -> Step 2: L2 Check', style: { stroke: '#dc2626', strokeWidth: 2 } },
  { id: 'e3', source: 'redisL2', target: 'dbMaster', label: 'L2 MISS -> Step 3: DB Query', style: { stroke: '#0284c7', strokeWidth: 2 } },
];

// ========================================================
// 10. DATABASE INDEXING OPTIMIZATION (BRIN vs B-Tree)
// ========================================================
export const indexingNodes: Node[] = [
  {
    id: 'queryFilter',
    type: 'infoNode',
    data: {
      badge: 'Audit Query',
      title: 'Clinical Time Range',
      caption: 'BETWEEN 2026-10-01 AND 2026-11-06',
      color: '#00a8b5',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'brinBlock',
    type: 'infoNode',
    data: {
      badge: 'BRIN Index (18MB)',
      title: 'Block Range Summary',
      caption: '128 pages per block range · 99.8% smaller than GIN',
      color: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'bufferPool',
    type: 'logoNode',
    data: {
      logo: 'postgresql',
      title: 'PostgreSQL Buffer',
      caption: 'Pages cached in shared_buffers',
      badge: 'Zero Disk IO',
      badgeColor: '#0284c7',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'auditResult',
    type: 'infoNode',
    data: {
      badge: '11.6x FASTER',
      title: 'Filtered Result Set',
      caption: 'Sub-4ms scan across 10M compliance records',
      color: '#2160fd',
    },
    position: { x: 0, y: 0 },
  },
];

export const indexingEdges: Edge[] = [
  { id: 'e1', source: 'queryFilter', target: 'brinBlock', label: 'Check range bounds', animated: true },
  { id: 'e2', source: 'brinBlock', target: 'bufferPool', label: 'Fetch matching blocks', style: { stroke: '#16a34a', strokeWidth: 2 } },
  { id: 'e3', source: 'bufferPool', target: 'auditResult', label: 'Return compliance records', style: { stroke: '#2160fd', strokeWidth: 2 } },
];

// ========================================================
// 11. PAYHERE WEBHOOK IDEMPOTENCY
// ========================================================
export const payhereWebhookNodes: Node[] = [
  {
    id: 'patientDevice',
    type: 'logoNode',
    data: {
      logo: 'mobile-app',
      title: 'Patient App',
      caption: 'Consultation Booking Checkout',
      badge: 'Client',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'payhereGateway',
    type: 'logoNode',
    data: {
      logo: 'payhere',
      title: 'PayHere Gateway',
      caption: 'Payment Notification Webhook',
      badge: 'MD5 Hash',
      badgeColor: '#0284c7',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'springWebhook',
    type: 'logoNode',
    data: {
      logo: 'spring-boot',
      title: 'Spring Boot 3.3',
      caption: 'Signature & MD5 Validation',
      badge: 'Controller',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'postgresLock',
    type: 'logoNode',
    data: {
      logo: 'postgresql',
      title: 'PostgreSQL 16',
      caption: 'SELECT FOR UPDATE payment_transactions',
      badge: 'Idempotency Lock',
      badgeColor: '#0284c7',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'escrowHold',
    type: 'infoNode',
    data: {
      badge: 'Escrow Vault',
      title: 'Doctor Wallet Credit',
      caption: 'Pending clinical sign-off status',
      color: '#d97706',
    },
    position: { x: 0, y: 0 },
  },
];

export const payhereWebhookEdges: Edge[] = [
  { id: 'e1', source: 'patientDevice', target: 'payhereGateway', label: '1: Pay consultation fee', animated: true },
  { id: 'e2', source: 'payhereGateway', target: 'springWebhook', label: '2: POST /notify with MD5 signature', animated: true, style: { stroke: '#0284c7', strokeWidth: 2 } },
  { id: 'e3', source: 'springWebhook', target: 'postgresLock', label: '3: Row lock payment_transactions', animated: true, style: { stroke: '#16a34a', strokeWidth: 2 } },
  { id: 'e4', source: 'postgresLock', target: 'escrowHold', label: '4: Credit doctor wallet in ESCROW', style: { stroke: '#d97706', strokeWidth: 2 } },
];

// ========================================================
// 12. PRESCRIPTIONS CATALOG & ZERO-PHI
// ========================================================
export const prescriptionsCatalogNodes: Node[] = [
  {
    id: 'doctorDevice',
    type: 'logoNode',
    data: {
      logo: 'mobile-app',
      title: 'Doctor Portal',
      caption: 'Active WebRTC Consultation Room',
      badge: 'Clinical Session',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'drugCatalog',
    type: 'infoNode',
    data: {
      badge: 'NMRA Drug Catalog',
      title: 'Prescription Builder',
      caption: 'Validated dosage, frequency & contraindications',
      color: '#00a8b5',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'maskingEngine',
    type: 'infoNode',
    data: {
      badge: 'Zero-PHI Masking',
      title: 'SHA-256 Pseudonymizer',
      caption: 'Strips patient NIC/Name from audit logs',
      color: '#dc2626',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'postgresVault',
    type: 'logoNode',
    data: {
      logo: 'postgresql',
      title: 'PostgreSQL 16',
      caption: 'Encrypted Prescriptions Ledger',
      badge: 'Clinical Vault',
      badgeColor: '#0284c7',
    },
    position: { x: 0, y: 0 },
  },
];

export const prescriptionsCatalogEdges: Edge[] = [
  { id: 'e1', source: 'doctorDevice', target: 'drugCatalog', label: 'Select medications', animated: true },
  { id: 'e2', source: 'drugCatalog', target: 'maskingEngine', label: 'Sanitize PHI payload', style: { stroke: '#dc2626', strokeWidth: 2 } },
  { id: 'e3', source: 'maskingEngine', target: 'postgresVault', label: 'Commit encrypted record', style: { stroke: '#0284c7', strokeWidth: 2 } },
];

// ========================================================
// 13. SSE REAL-TIME TOKEN REFRESH & HANDSHAKE
// ========================================================
export const sseRefreshNodes: Node[] = [
  {
    id: 'clientApp',
    type: 'logoNode',
    data: {
      logo: 'mobile-app',
      title: 'Client Ingress',
      caption: 'Flutter / Next.js Webview',
      badge: 'EventSource',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'springSse',
    type: 'logoNode',
    data: {
      logo: 'spring-boot',
      title: 'Spring SseEmitter',
      caption: 'Persistent HTTP connection pool',
      badge: 'Sub-20ms Heartbeat',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'tokenRefresher',
    type: 'infoNode',
    data: {
      badge: 'Sliding TTL',
      title: 'JWT Auto-Refresh',
      caption: 'Extends 15m expiration on active stream',
      color: '#2563eb',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'redisPresence',
    type: 'logoNode',
    data: {
      logo: 'redis',
      title: 'Redis 7.2 Cluster',
      caption: 'Presence & Room State Pub/Sub',
      badge: 'In-Memory',
      badgeColor: '#dc2626',
    },
    position: { x: 0, y: 0 },
  },
];

export const sseRefreshEdges: Edge[] = [
  { id: 'e1', source: 'clientApp', target: 'springSse', label: 'GET /api/v1/events/subscribe', animated: true },
  { id: 'e2', source: 'springSse', target: 'tokenRefresher', label: 'Heartbeat ping (30s)' },
  { id: 'e3', source: 'springSse', target: 'redisPresence', label: 'Publish presence heartbeat', style: { stroke: '#dc2626', strokeWidth: 2 } },
];

// ========================================================
// 14. DISTRIBUTED BACKGROUND SCHEDULERS
// ========================================================
export const schedulersNodes: Node[] = [
  {
    id: 'schedulerLeader',
    type: 'logoNode',
    data: {
      logo: 'spring-boot',
      title: 'Scheduler Node',
      caption: '@Scheduled cron triggering tasks',
      badge: 'Leader Election',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'shedlockLock',
    type: 'infoNode',
    data: {
      badge: 'Distributed Mutex',
      title: 'ShedLock Table',
      caption: 'lock_until timestamp prevents multi-node race',
      color: '#00a8b5',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'workerThreads',
    type: 'infoNode',
    data: {
      badge: 'Concurrency Engine',
      title: 'Java 21 Virtual Threads',
      caption: 'Non-blocking worker per background task',
      color: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'archiverTask',
    type: 'logoNode',
    data: {
      logo: 'cloudflare-r2',
      title: 'Cloudflare R2',
      caption: 'LOG-05 Archival & Eviction Job',
      badge: 'WORM Vault',
      badgeColor: '#f97316',
    },
    position: { x: 0, y: 0 },
  },
];

export const schedulersEdges: Edge[] = [
  { id: 'e1', source: 'schedulerLeader', target: 'shedlockLock', label: 'Acquire lock (PostgreSQL/Redis)', animated: true },
  { id: 'e2', source: 'shedlockLock', target: 'workerThreads', label: 'Lock granted -> Spawn worker', style: { stroke: '#16a34a', strokeWidth: 2 } },
  { id: 'e3', source: 'workerThreads', target: 'archiverTask', label: 'Execute archival stream', style: { stroke: '#f97316', strokeWidth: 2 } },
];

// ========================================================
// 15. SUBSCRIPTION PLANS & IN-CALL DURATIONS
// ========================================================
export const subscriptionPlansNodes: Node[] = [
  {
    id: 'patient',
    type: 'logoNode',
    data: {
      logo: 'mobile-app',
      title: 'Patient Ingress',
      caption: 'Subscription tier request',
      badge: 'Tier Selector',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'planCheck',
    type: 'infoNode',
    data: {
      badge: 'Quota Validation',
      title: 'Bucket4j Plan Resolver',
      caption: 'Essential / Pro / Emergency entitlement',
      color: '#0284c7',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'livekitRoom',
    type: 'logoNode',
    data: {
      logo: 'livekit',
      title: 'LiveKit SFU',
      caption: 'Configured room (15m / 30m / 45m)',
      badge: 'Dynamic Timeout',
      badgeColor: '#2160fd',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'extensionLock',
    type: 'infoNode',
    data: {
      badge: 'CALL-EXT-01',
      title: 'In-Call Extension',
      caption: '+15m top-up with doctor acceptance',
      color: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
];

export const subscriptionPlansEdges: Edge[] = [
  { id: 'e1', source: 'patient', target: 'planCheck', label: 'Select consultation plan', animated: true },
  { id: 'e2', source: 'planCheck', target: 'livekitRoom', label: 'Issue token with expiry', style: { stroke: '#2160fd', strokeWidth: 2 } },
  { id: 'e3', source: 'livekitRoom', target: 'extensionLock', label: 'Warning at 2 min remaining -> Request Extension', style: { stroke: '#16a34a', strokeDasharray: '4,4' } },
];

// ========================================================
// 16. RBAC & SUPERADMIN REGISTRATION FLOW
// ========================================================
export const rbacNodes: Node[] = [
  {
    id: 'userRegister',
    type: 'logoNode',
    data: {
      logo: 'mobile-app',
      title: 'Registration Ingress',
      caption: 'Phone + OTP or OAuth',
      badge: 'Public Tier',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'springSecurity',
    type: 'logoNode',
    data: {
      logo: 'spring-boot',
      title: 'Spring Security 6',
      caption: 'Role Hierarchy Enforcement',
      badge: 'RBAC Evaluator',
      badgeColor: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'rolesGroup',
    type: 'infoNode',
    data: {
      badge: 'Role Hierarchy',
      title: 'SUPER_ADMIN > ADMIN > DOCTOR > PATIENT',
      caption: 'Least privilege access control',
      color: '#00a8b5',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'pseudonymizer',
    type: 'infoNode',
    data: {
      badge: 'PDPA Compliance',
      title: 'Pseudonymous Masker',
      caption: 'Zero patient NIC/Name in public logs',
      color: '#dc2626',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'postgresUsers',
    type: 'logoNode',
    data: {
      logo: 'postgresql',
      title: 'PostgreSQL 16',
      caption: 'Encrypted Credential Vault',
      badge: 'Argon2id Hash',
      badgeColor: '#0284c7',
    },
    position: { x: 0, y: 0 },
  },
];

export const rbacEdges: Edge[] = [
  { id: 'e1', source: 'userRegister', target: 'springSecurity', label: 'POST /api/v1/auth/register', animated: true },
  { id: 'e2', source: 'springSecurity', target: 'rolesGroup', label: 'Assign default role (PATIENT)', style: { stroke: '#00a8b5', strokeWidth: 2 } },
  { id: 'e3', source: 'rolesGroup', target: 'pseudonymizer', label: 'Generate masked identifier', style: { stroke: '#dc2626', strokeWidth: 2 } },
  { id: 'e4', source: 'pseudonymizer', target: 'postgresUsers', label: 'Persist with Argon2id hash', animated: true, style: { stroke: '#0284c7', strokeWidth: 2 } },
];

// ========================================================
// 17. ESCROW DOUBLE-ENTRY SETTLEMENT
// ========================================================
export const escrowNodes: Node[] = [
  {
    id: 'patientFee',
    type: 'logoNode',
    data: {
      logo: 'payhere',
      title: 'Patient Payment',
      caption: 'LKR 4,500 Consultation Fee',
      badge: 'PayHere Settled',
      badgeColor: '#0284c7',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'escrowVault',
    type: 'infoNode',
    data: {
      badge: 'Custodial Holding',
      title: 'Escrow Account (HOLD)',
      caption: 'Funds locked during consultation',
      color: '#d97706',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'doctorSignoff',
    type: 'infoNode',
    data: {
      badge: 'Clinical Completion',
      title: 'Doctor Sign-off',
      caption: 'End Call + Clinical Notes Saved',
      color: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'doctorWallet',
    type: 'infoNode',
    data: {
      badge: '85% Allocation',
      title: 'Doctor Wallet (LKR 3,825)',
      caption: 'Available for weekly bank withdrawal',
      color: '#16a34a',
    },
    position: { x: 0, y: 0 },
  },
  {
    id: 'platformFee',
    type: 'infoNode',
    data: {
      badge: '15% Allocation',
      title: 'HITHA Platform (LKR 675)',
      caption: 'Infrastructure & WebRTC SFU operational fee',
      color: '#2160fd',
    },
    position: { x: 0, y: 0 },
  },
];

export const escrowEdges: Edge[] = [
  { id: 'e1', source: 'patientFee', target: 'escrowVault', label: 'Lock in Escrow', animated: true, style: { stroke: '#d97706', strokeWidth: 2 } },
  { id: 'e2', source: 'escrowVault', target: 'doctorSignoff', label: 'Awaiting clinical completion' },
  { id: 'e3', source: 'doctorSignoff', target: 'doctorWallet', label: 'Credit 85% on sign-off', animated: true, style: { stroke: '#16a34a', strokeWidth: 2 } },
  { id: 'e4', source: 'doctorSignoff', target: 'platformFee', label: 'Credit 15% platform split', animated: true, style: { stroke: '#2160fd', strokeWidth: 2 } },
];
