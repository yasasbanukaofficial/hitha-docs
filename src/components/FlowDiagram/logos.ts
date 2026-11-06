export interface LogoItem {
  name: string;
  src: string;
  color: string;
}

export const LOGO_REGISTRY: Record<string, LogoItem> = {
  redis: {
    name: 'Redis',
    src: '/img/logos/redis.svg',
    color: '#D82C20',
  },
  postgresql: {
    name: 'PostgreSQL',
    src: '/img/logos/postgresql.svg',
    color: '#336791',
  },
  'spring-boot': {
    name: 'Spring Boot',
    src: '/img/logos/spring-boot.svg',
    color: '#6DB33F',
  },
  'cloudflare-r2': {
    name: 'Cloudflare R2',
    src: '/img/logos/cloudflare-r2.svg',
    color: '#F38020',
  },
  livekit: {
    name: 'LiveKit',
    src: '/img/logos/livekit.svg',
    color: '#2160FD',
  },
  hitha: {
    name: 'HITHA',
    src: '/img/logos/hitha.svg',
    color: '#00A8B5',
  },
  java: {
    name: 'Java 21',
    src: '/img/logos/java.svg',
    color: '#E76F00',
  },
  logback: {
    name: 'Logback',
    src: '/img/logos/logback.svg',
    color: '#2563EB',
  },
  bucket4j: {
    name: 'Bucket4j',
    src: '/img/logos/bucket4j.svg',
    color: '#0284C7',
  },
  'mobile-app': {
    name: 'Client App',
    src: '/img/logos/mobile-app.svg',
    color: '#16A34A',
  },
  'client-ingress': {
    name: 'Client Ingress',
    src: '/img/logos/client-ingress.svg',
    color: '#475569',
  },
  payhere: {
    name: 'PayHere Gateway',
    src: '/img/logos/payhere.svg',
    color: '#0284C7',
  },
  patient: {
    name: 'Patient',
    src: '/img/logos/patient.svg',
    color: '#3B82F6',
  },
  doctor: {
    name: 'Doctor',
    src: '/img/logos/doctor.svg',
    color: '#16A34A',
  },
  admin: {
    name: 'Admin',
    src: '/img/logos/admin.svg',
    color: '#00A8B5',
  },
  superadmin: {
    name: 'Super Admin',
    src: '/img/logos/superadmin.svg',
    color: '#EAB308',
  },
  bot: {
    name: 'Attacker Bot',
    src: '/img/logos/bot.svg',
    color: '#DC2626',
  },
  auditor: {
    name: 'Auditor',
    src: '/img/logos/auditor.svg',
    color: '#475569',
  },
  archive: {
    name: 'Archive Job',
    src: '/img/logos/archive.svg',
    color: '#D97706',
  },
  lock: {
    name: 'Gate Lock',
    src: '/img/logos/lock.svg',
    color: '#0F172A',
  },
  disk: {
    name: 'Local Disk',
    src: '/img/logos/disk.svg',
    color: '#16A34A',
  },
};
