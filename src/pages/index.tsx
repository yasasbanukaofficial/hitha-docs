import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import CommandSearchModal from '../components/CommandSearchModal';
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
  Sparkles
} from 'lucide-react';

export default function Home(): React.JSX.Element {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global hotkey Ctrl+K / Cmd+K / Slash to open modal
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
      description="Interactive Architecture, Dual-Plane Logging, Rate Limiting & Technical Glossary">
      
      {/* Interactive Command Search Modal */}
      <CommandSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <main className="landing-root">
        {/* Modern Hero Section */}
        <section className="hero-section">
          <div className="hero-glow-radial"></div>

          <div className="hero-container">
            {/* Top Eyebrow Badge */}
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot"></span>
              <span>Enterprise Telehealth Distributed System</span>
              <span className="hero-eyebrow-pill">Production Architecture</span>
            </div>

            {/* Main Headline */}
            <h1 className="hero-heading">
              HITHA Architecture <br />
              <span className="hero-gradient-text">& Engineering Portal</span>
            </h1>

            <p className="hero-description">
              Production blueprints, dual-plane logging lifecycles, distributed rate limiting, 
              and technical specifications explained with concrete real scenarios and conversational Sinhala breakdowns.
            </p>

            {/* Interactive Spotlight Search Trigger */}
            <div className="hero-search-wrapper" onClick={() => setIsSearchOpen(true)}>
              <div className="hero-search-bar">
                <div className="hero-search-left">
                  <Search className="hero-search-icon" />
                  <span className="hero-search-placeholder">
                    Search architecture, SQL queries, concepts, or Sinhala guides...
                  </span>
                </div>
                <div className="hero-search-right">
                  <kbd className="hero-search-kbd">⌘K</kbd>
                  <span className="hero-search-hint">or press <kbd className="hero-search-kbd">/</kbd></span>
                </div>
              </div>
            </div>

            {/* Quick Filter Tag Buttons */}
            <div className="hero-tags">
              <span className="hero-tags-label">Quick Jump:</span>
              <button className="hero-tag-btn" onClick={() => setIsSearchOpen(true)}>
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Dual-Plane Logging</span>
              </button>
              <button className="hero-tag-btn" onClick={() => setIsSearchOpen(true)}>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>4-Tier Rate Limiting</span>
              </button>
              <button className="hero-tag-btn" onClick={() => setIsSearchOpen(true)}>
                <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
                <span>LiveKit WebRTC</span>
              </button>
              <button className="hero-tag-btn" onClick={() => setIsSearchOpen(true)}>
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Escrow Wallet</span>
              </button>
              <button className="hero-tag-btn" onClick={() => setIsSearchOpen(true)}>
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                <span>Technical Terms (සිංහල)</span>
              </button>
            </div>
          </div>
        </section>

        {/* Feature Grid / Core Domains */}
        <section className="domains-section">
          <div className="domains-container">
            <div className="domains-header">
              <div className="domains-header-left">
                <span className="section-badge">Core Domains</span>
                <h2 className="section-title">Explore Production Architecture</h2>
              </div>
              <Link to="/docs/" className="view-all-link">
                <span>Browse all 19 chapters</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="cards-grid">
              {/* Card 1: Logging & Audit */}
              <div className="feature-card">
                <div className="card-top">
                  <div className="card-icon-box amber">
                    <Terminal className="w-6 h-6" />
                  </div>
                  <span className="card-status-badge">LOG-01 — LOG-10</span>
                </div>
                <h3 className="card-title">Dual-Plane Logging & Audit Architecture</h3>
                <p className="card-desc">
                  Separates high-frequency operational logs (capped 5GB local rolling files) from legally-binding clinical audit logs (SHA-256 hash chained, PostgreSQL partitioned tables, and 7-year Cloudflare R2 cold WORM archival).
                </p>
                <div className="card-features-list">
                  <div className="card-feature-item">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>PostgreSQL Advisory Locks for SHA-256 hash chaining</span>
                  </div>
                  <div className="card-feature-item">
                    <Cpu className="w-4 h-4 text-amber-400" />
                    <span>HikariCP 401 connection exhaustion defense</span>
                  </div>
                </div>
                <div className="card-actions">
                  <Link to="/docs/logging-audit/dual-plane-architecture" className="card-btn-primary">
                    <span>Architecture Guide</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                  <Link to="/docs/logging-audit/deep-technical-mechanisms" className="card-btn-secondary">
                    Q&A Defense
                  </Link>
                </div>
              </div>

              {/* Card 2: Security & Rate Limiting */}
              <div className="feature-card">
                <div className="card-top">
                  <div className="card-icon-box rose">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <span className="card-status-badge">SEC-01 — SEC-04</span>
                </div>
                <h3 className="card-title">Distributed Rate Limiting & Auth</h3>
                <p className="card-desc">
                  4-tier distributed Bucket4j token bucket rate limiting protecting HikariCP pools from DoS, combined with seamless SSE JWT renew handshakes and RBAC Super Admin governance.
                </p>
                <div className="card-features-list">
                  <div className="card-feature-item">
                    <Lock className="w-4 h-4 text-rose-400" />
                    <span>Zero-touch SSE token rotation without disconnection</span>
                  </div>
                  <div className="card-feature-item">
                    <ShieldCheck className="w-4 h-4 text-rose-400" />
                    <span>Clinical fail-open rule with atomic rate limit logging</span>
                  </div>
                </div>
                <div className="card-actions">
                  <Link to="/docs/security/rate-limiting" className="card-btn-primary">
                    <span>Rate Limiting Specs</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                  <Link to="/docs/security/sse-token-refresh" className="card-btn-secondary">
                    SSE Lifecycle
                  </Link>
                </div>
              </div>

              {/* Card 3: Clinical & Real-Time */}
              <div className="feature-card">
                <div className="card-top">
                  <div className="card-icon-box cyan">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <span className="card-status-badge">RTC-01 — RTC-03</span>
                </div>
                <h3 className="card-title">Clinical RTC & Emergency Queue</h3>
                <p className="card-desc">
                  LiveKit SFU WebRTC encrypted rooms with mid-call duration extensions (15m, 30m, 45m), paired with pessimistic SELECT FOR UPDATE emergency doctor dispatch.
                </p>
                <div className="card-features-list">
                  <div className="card-feature-item">
                    <Zap className="w-4 h-4 text-cyan-400" />
                    <span>Redis presence pool for active on-duty doctors</span>
                  </div>
                  <div className="card-feature-item">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <span>Drug catalog with Zero-PHI audit compliance</span>
                  </div>
                </div>
                <div className="card-actions">
                  <Link to="/docs/clinical/livekit-webrtc" className="card-btn-primary">
                    <span>WebRTC Engine</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                  <Link to="/docs/clinical/on-demand-queue" className="card-btn-secondary">
                    Emergency Dispatch
                  </Link>
                </div>
              </div>

              {/* Card 4: Financial & Escrow */}
              <div className="feature-card">
                <div className="card-top">
                  <div className="card-icon-box emerald">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <span className="card-status-badge">PAY-01 — PAY-03</span>
                </div>
                <h3 className="card-title">Doctor Escrow & PayHere Webhooks</h3>
                <p className="card-desc">
                  Multi-account double-entry ledger with automated 15% platform commission deduction and idempotent PayHere webhook signatures using MD5 checksum validation.
                </p>
                <div className="card-features-list">
                  <div className="card-feature-item">
                    <Lock className="w-4 h-4 text-emerald-400" />
                    <span>Escrow funds locked until consultation sign-off</span>
                  </div>
                  <div className="card-feature-item">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    <span>Monthly subscription quota ledger with rollover guards</span>
                  </div>
                </div>
                <div className="card-actions">
                  <Link to="/docs/financial/doctor-wallet-escrow" className="card-btn-primary">
                    <span>Escrow Ledger</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                  <Link to="/docs/financial/payhere-webhook-idempotency" className="card-btn-secondary">
                    Webhook Verification
                  </Link>
                </div>
              </div>

              {/* Card 5: Engineering Glossary & Dictionary */}
              <div className="feature-card">
                <div className="card-top">
                  <div className="card-icon-box indigo">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="card-status-badge">GLOSSARY & TIMELINE</span>
                </div>
                <h3 className="card-title">Technical Terms Dictionary (සිංහල & English)</h3>
                <p className="card-desc">
                  24+ advanced architectural concepts (Pessimistic Locking, WORM, Hash Chain, BRIN Index, Outbox DLQ) explained using everyday real-world analogies and clear Sinhala breakdowns.
                </p>
                <div className="card-features-list">
                  <div className="card-feature-item">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Zero confusing jargon — simplified for instant understanding</span>
                  </div>
                  <div className="card-feature-item">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span>Real daily engineering timeline with live git commits</span>
                  </div>
                </div>
                <div className="card-actions">
                  <Link to="/docs/reference/technical-terms-dictionary" className="card-btn-primary">
                    <span>Terms Dictionary</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                  <Link to="/docs/engineering-timeline/daily-timeline" className="card-btn-secondary">
                    Engineering Timeline
                  </Link>
                </div>
              </div>

              {/* Card 6: Database & Caching Optimization */}
              <div className="feature-card">
                <div className="card-top">
                  <div className="card-icon-box violet">
                    <Database className="w-6 h-6" />
                  </div>
                  <span className="card-status-badge">DB-01 — DB-04</span>
                </div>
                <h3 className="card-title">Database Indexing & Multi-Tier Caching</h3>
                <p className="card-desc">
                  Sub-10ms query optimization using PostgreSQL BRIN indexes for append-only logs, dropping heavy GIN indexes, Redis 7 token caching, and Transactional Outbox pattern with DLQ.
                </p>
                <div className="card-features-list">
                  <div className="card-feature-item">
                    <Zap className="w-4 h-4 text-violet-400" />
                    <span>BRIN index: 95% smaller index footprint than B-Tree</span>
                  </div>
                  <div className="card-feature-item">
                    <Cpu className="w-4 h-4 text-violet-400" />
                    <span>60-second in-memory doctor dashboard cache TTL</span>
                  </div>
                </div>
                <div className="card-actions">
                  <Link to="/docs/reference/database-indexing-optimization" className="card-btn-primary">
                    <span>Indexing Strategy</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                  <Link to="/docs/reference/caching-architecture" className="card-btn-secondary">
                    Caching Architecture
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Architecture Execution Flow Section */}
        <section className="architecture-flow-section">
          <div className="architecture-flow-container">
            <div className="flow-card">
              <div className="flow-card-badge">System Overview</div>
              <h2 className="flow-title">Multi-Tier Distributed Healthcare Topology</h2>
              <p className="flow-subtitle">
                High-availability request routing, edge security, asynchronous event streaming, and 7-year immutable audit storage.
              </p>

              <div className="flow-steps-grid">
                <div className="flow-step-box">
                  <div className="flow-step-num">01</div>
                  <h4>Edge & Client Layer</h4>
                  <p>Flutter Mobile Apps & Next.js Web Portal route via Cloudflare with DDoS protection and token bucket rate limits.</p>
                </div>
                <div className="flow-step-box">
                  <div className="flow-step-num">02</div>
                  <h4>Virtual Thread Backend</h4>
                  <p>Spring Boot 3.3 running on Java 21 Virtual Threads, handling 10,000+ concurrent telehealth calls with minimal thread overhead.</p>
                </div>
                <div className="flow-step-box">
                  <div className="flow-step-num">03</div>
                  <h4>Dual-Plane Storage</h4>
                  <p>Local 5GB rolling logs for fast debug triage + PostgreSQL 16 partitioned tables with SHA-256 tamper-proof chaining.</p>
                </div>
                <div className="flow-step-box">
                  <div className="flow-step-num">04</div>
                  <h4>Cold Compliance Archive</h4>
                  <p>Automated monthly partition detach and gzip streaming to Cloudflare R2 bucket with 7-year WORM immutability.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
