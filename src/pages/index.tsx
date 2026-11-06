import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import BrowserOnly from '@docusaurus/BrowserOnly';
import CommandSearchModal from '../components/CommandSearchModal';
import InteractiveTopologyFlow from '../components/InteractiveTopologyFlow';
import { 
  Search, 
  Terminal, 
  ShieldCheck, 
  Stethoscope, 
  DollarSign, 
  BookOpen, 
  ArrowRight, 
  Zap, 
  Layers, 
  Database,
  Cpu,
  Lock,
  Clock,
  Sparkles,
  Video,
  PhoneCall,
  Radio,
  FileCode,
  Github,
  HelpCircle,
  ExternalLink,
  Users
} from 'lucide-react';

export default function Home(): React.JSX.Element {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Layout
      title="HITHA Architecture & Engineering Portal"
      description="Production Blueprints, Dual-Plane Logging, LiveKit WebRTC & Distributed Architecture">
      
      <CommandSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <main className="landing-root">
        {/* ========================================================
            SECTION 1: HERO "Build with HITHA"
            ======================================================== */}
        <section className="hero-section">
          <div className="hero-glow-radial"></div>

          <div className="hero-container">
            <h1 className="hero-heading">
              Build with HITHA <br />
              <span className="hero-gradient-text">Healthcare Distributed System</span>
            </h1>

            <p className="hero-description">
              Production blueprints, dual-plane logging pipelines, distributed rate limiting, 
              and WebRTC telehealth engines built with Spring Boot 3.3, PostgreSQL 16, and Java 21 Virtual Threads.
            </p>

            {/* Spotlight Search Trigger */}
            <div className="hero-search-wrapper" onClick={() => setIsSearchOpen(true)}>
              <div className="hero-search-bar">
                <div className="hero-search-left">
                  <Search className="hero-search-icon" />
                  <span className="hero-search-placeholder">
                    Search architecture, SQL queries, concepts, or guides...
                  </span>
                </div>
                <div className="hero-search-right">
                  <kbd className="hero-search-kbd">⌘K</kbd>
                  <span className="hero-search-hint">or <kbd className="hero-search-kbd">/</kbd></span>
                </div>
              </div>
            </div>

            {/* 3 Core Capability Cards (Live Video, Emergency Calls, Interactive Queue) */}
            <div className="hero-feature-cards-grid">
              <Link to="/docs/clinical/livekit-webrtc" className="hero-card-link">
                <div className="hero-card-icon cyan">
                  <Video className="w-6 h-6" />
                </div>
                <h3 className="hero-card-title">Live Video Consultations</h3>
                <p className="hero-card-desc">
                  Sub-200ms WebRTC consultation rooms powered by LiveKit SFU with in-call dynamic 15m/30m/45m extensions.
                </p>
                <span className="hero-card-cta">Explore LiveKit Engine →</span>
              </Link>

              <Link to="/docs/clinical/on-demand-queue" className="hero-card-link">
                <div className="hero-card-icon emerald">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <h3 className="hero-card-title">Emergency Doctor Dispatch</h3>
                <p className="hero-card-desc">
                  Instant doctor assignment using Redis presence pools and PostgreSQL pessimistic row locking (<code className="hero-inline-code">SELECT FOR UPDATE</code>).
                </p>
                <span className="hero-card-cta">View Queue Dispatcher →</span>
              </Link>

              <Link to="/docs/logging-audit/dual-plane-architecture" className="hero-card-link">
                <div className="hero-card-icon amber">
                  <Terminal className="w-6 h-6" />
                </div>
                <h3 className="hero-card-title">Dual-Plane Logging</h3>
                <p className="hero-card-desc">
                  Zero database bloat: 5GB local rolling debug logs paired with SHA-256 tamper-proof clinical compliance logs.
                </p>
                <span className="hero-card-cta">Inspect Dual-Plane Model →</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 2: POPULAR HOW-TO GUIDES
            ======================================================== */}
        <section className="guides-section">
          <div className="section-container">
            <div className="section-header-flex">
              <div>
                <span className="section-eyebrow-badge">Popular How-To Guides</span>
                <h2 className="section-main-heading">Core Engineering Guides</h2>
              </div>
              <Link to="/docs/" className="section-view-all">
                <span>View all guides</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="guides-cards-grid">
              <Link to="/docs/logging-audit/dual-plane-architecture" className="guide-card">
                <h4 className="guide-card-title">How to Configure Dual-Plane Logging &amp; Auto-Eviction</h4>
                <p className="guide-card-desc">Enforce 100MB/hourly gzip rolling and 5GB disk cap with Logback AsyncAppender.</p>
              </Link>

              <Link to="/docs/security/rate-limiting" className="guide-card">
                <h4 className="guide-card-title">How to Set Up 4-Tier Distributed Rate Limiting</h4>
                <p className="guide-card-desc">Protect HikariCP connection pools with Bucket4j pre-authentication filters.</p>
              </Link>

              <Link to="/docs/financial/doctor-wallet-escrow" className="guide-card">
                <h4 className="guide-card-title">How the Escrow Custody Ledger Settles Earnings</h4>
                <p className="guide-card-desc">Hold patient consultation payments in escrow until explicit clinical sign-off.</p>
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 3: SAMPLE IMPLEMENTATIONS & FLOW DIAGRAMS
            ======================================================== */}
        <section className="sample-apps-section">
          <div className="section-container">
            <div className="section-header-flex">
              <div>
                <span className="section-eyebrow-badge">Interactive System Blueprint</span>
                <h2 className="section-main-heading">Live Interactive System Topology</h2>
              </div>
              <Link to="/docs/clinical/livekit-webrtc" className="section-view-all">
                <span>View Full Architecture Specs</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div style={{ margin: '24px 0 48px' }}>
              <BrowserOnly fallback={<div style={{ height: '420px', background: '#f8fbff', borderRadius: '16px' }} />}>
                {() => <InteractiveTopologyFlow />}
              </BrowserOnly>
            </div>

            <div className="section-header-flex">
              <div>
                <span className="section-eyebrow-badge">Production Architecture</span>
                <h2 className="section-main-heading">Visual Architecture Schematics</h2>
              </div>
              <Link to="/docs/logging-audit/task-roadmap-and-progress" className="section-view-all">
                <span>View Roadmap (LOG-01 to LOG-10)</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="sample-apps-grid">
              <div className="sample-app-card">
                <div className="sample-card-badge">Figure 1.0</div>
                <h4>Dual-Plane Logging Pipeline</h4>
                <p>Separates Plane A (5GB local files) from Plane B (PostgreSQL hot table + Cloudflare R2 WORM cold archive).</p>
                <div className="sample-card-actions">
                  <Link to="/docs/logging-audit/dual-plane-architecture" className="sample-action-link">
                    Open Diagram →
                  </Link>
                </div>
              </div>

              <div className="sample-app-card">
                <div className="sample-card-badge">Figure 2.0</div>
                <h4>Bucket4j Rate Limiter Tiers</h4>
                <p>Pre-authentication filter layer dropping malicious bursts with zero JDBC connection overhead.</p>
                <div className="sample-card-actions">
                  <Link to="/docs/security/rate-limiting" className="sample-action-link">
                    Open Diagram →
                  </Link>
                </div>
              </div>

              <div className="sample-app-card">
                <div className="sample-card-badge">Figure 7.0</div>
                <h4>Cloudflare R2 Cold Archival</h4>
                <p>Streaming historical audit records to .jsonl.gz archives with SHA-256 manifests (LOG-05).</p>
                <div className="sample-card-actions">
                  <Link to="/docs/logging-audit/task-roadmap-and-progress" className="sample-action-link">
                    Open Diagram →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 4: FRAMEWORK & PLATFORM INTEGRATION
            ======================================================== */}
        <section className="framework-section">
          <div className="section-container">
            <h2 className="framework-heading">Build the way you want in the framework you want!</h2>
            <p className="framework-subtitle">
              HITHA provides native SDKs and backend micro-integrations across all major client platforms.
            </p>

            <div className="framework-boxes-grid">
              <div className="framework-box">
                <div className="framework-box-header">
                  <span className="framework-box-badge">UI Kit</span>
                  <h3>Clinical Frontend UI Components</h3>
                  <p>Pre-built video lobby, doctor consulting controls, and E-Prescription modules.</p>
                </div>
                <div className="framework-pills-row">
                  <span className="framework-pill">Flutter Mobile</span>
                  <span className="framework-pill">Next.js Web</span>
                  <span className="framework-pill">React 18</span>
                  <span className="framework-pill">Tailwind CSS</span>
                </div>
              </div>

              <div className="framework-box">
                <div className="framework-box-header">
                  <span className="framework-box-badge core">Core Engine</span>
                  <h3>High-Performance Microservices</h3>
                  <p>Zero-overhead Virtual Threads handling 10,000+ concurrent telehealth sessions.</p>
                </div>
                <div className="framework-pills-row">
                  <span className="framework-pill">Spring Boot 3.3</span>
                  <span className="framework-pill">Java 21 Virtual Threads</span>
                  <span className="framework-pill">PostgreSQL 16 (BRIN)</span>
                  <span className="framework-pill">Redis 7 Cluster</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 5: REST API REFERENCE OVERVIEW
            ======================================================== */}
        <section className="api-preview-section">
          <div className="section-container">
            <div className="api-preview-grid">
              <div className="api-preview-left">
                <span className="section-eyebrow-badge">REST API Reference</span>
                <h2 className="api-preview-title">HITHA Core Telehealth APIs</h2>
                <p className="api-preview-desc">
                  Idempotent payment endpoints, real-time consultation dispatch, LiveKit room tokens, and tamper-proof audit verification APIs.
                </p>
                <Link to="/docs/financial/payhere-webhook-idempotency" className="api-preview-cta">
                  <span>Explore Payment &amp; Escrow APIs</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>

                <div className="api-endpoints-list">
                  <Link to="/docs/clinical/livekit-webrtc" className="api-endpoint-row">
                    <span className="api-method post">POST</span>
                    <span className="api-path">/api/v1/clinical/consultations/create-room</span>
                    <ArrowRight className="w-4 h-4 api-row-arrow" />
                  </Link>

                  <Link to="/docs/clinical/on-demand-queue" className="api-endpoint-row">
                    <span className="api-method post">POST</span>
                    <span className="api-path">/api/v1/on-demand/call-now</span>
                    <ArrowRight className="w-4 h-4 api-row-arrow" />
                  </Link>

                  <Link to="/docs/financial/payhere-webhook-idempotency" className="api-endpoint-row">
                    <span className="api-method post">POST</span>
                    <span className="api-path">/api/v1/payments/payhere/notify</span>
                    <ArrowRight className="w-4 h-4 api-row-arrow" />
                  </Link>
                </div>
              </div>

              <div className="api-preview-right">
                <div className="api-code-window">
                  <div className="window-header">
                    <div className="window-dots">
                      <span className="dot red"></span>
                      <span className="dot yellow"></span>
                      <span className="dot green"></span>
                    </div>
                    <span className="window-title">ConsultationSessionResponse.json</span>
                  </div>
                  <pre className="window-code">
{`{
  "bookingId": "bk_987214e2",
  "roomName": "room_conf_c47890",
  "patientToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "doctorToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "sessionDuration": 1800,
  "escrowStatus": "HELD_IN_CUSTODY",
  "escrowAmount": 3500.00,
  "currency": "LKR",
  "auditProof": {
    "chainIndex": 14209,
    "sha256Hash": "8f3b2a9e10d4817c...",
    "storagePlane": "PLANE_B_POSTGRES"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================
            SECTION 6: HOW CAN WE HELP YOU TODAY?
            ======================================================== */}
        <section className="help-section">
          <div className="section-container">
            <h2 className="help-heading">Engineering &amp; Support Resources</h2>
            <div className="help-cards-grid">
              <Link to="/docs/reference/technical-terms-dictionary" className="help-card">
                <BookOpen className="w-6 h-6 text-cyan-400 mb-3" />
                <h3>Architecture Glossary</h3>
                <p>24+ technical terms (BRIN index, WORM storage, Escrow custody, Outbox DLQ) explained with codebase pointers.</p>
                <span className="help-card-link">Read Glossary →</span>
              </Link>

              <Link to="/docs/engineering-timeline/daily-timeline" className="help-card">
                <Clock className="w-6 h-6 text-emerald-400 mb-3" />
                <h3>Daily Engineering Timeline</h3>
                <p>Review the exact commits, tests, and deliverables merged into the Hitha server today.</p>
                <span className="help-card-link">View Timeline →</span>
              </Link>

              <Link to="/docs/logging-audit/deep-technical-mechanisms" className="help-card">
                <ShieldCheck className="w-6 h-6 text-amber-400 mb-3" />
                <h3>Deep Mechanism Q&amp;A</h3>
                <p>Technical defense covering hash-chain concurrency, 401 connection pool exhaustion, and indexing trade-offs.</p>
                <span className="help-card-link">Inspect Q&amp;A →</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
