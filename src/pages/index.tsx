import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function Home(): React.JSX.Element {
  return (
    <Layout
      title="HITHA Architecture & Engineering Portal"
      description="Interactive Architecture, Dual-Plane Logging, Rate Limiting & Technical Glossary">
      <main>
        <section className="heroBanner">
          <div className="container">
            <span className="modernCardBadge">Healthcare Distributed Systems</span>
            <h1 className="heroTitle">HITHA Architecture Portal</h1>
            <p className="heroSubtitle">
              Comprehensive architectural guides, live dual-plane logging pipelines, distributed rate limiting, and technical glossary with plain Sinhala and English breakdowns.
            </p>

            {/* Google-Style Center Search Box */}
            <div className="googleSearchHero">
              <input
                type="text"
                className="googleSearchInput"
                placeholder="Search architecture, concepts, SQL queries, or Sinhala explanations (e.g. hash chain, dual plane, rate limit)..."
                onFocus={(e) => {
                  // Focus the global docusaurus search bar if available
                  const searchBtn = document.querySelector('.navbar__search input') as HTMLInputElement;
                  if (searchBtn) {
                    searchBtn.focus();
                  }
                }}
                onClick={() => {
                  const searchBtn = document.querySelector('.navbar__search input') as HTMLInputElement;
                  if (searchBtn) {
                    searchBtn.focus();
                  }
                }}
              />
              <span className="googleSearchIcon">🔍</span>
            </div>

            {/* Quick Filter Navigation Buttons */}
            <div style={{display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem'}}>
              <Link to="/docs/logging-audit/dual-plane-architecture" className="button button--secondary button--sm" style={{borderRadius: '9999px', padding: '8px 18px'}}>
                ⚡ Dual-Plane Logging
              </Link>
              <Link to="/docs/logging-audit/task-roadmap-and-progress" className="button button--secondary button--sm" style={{borderRadius: '9999px', padding: '8px 18px'}}>
                🚀 LOG-01 to LOG-10 Progress
              </Link>
              <Link to="/docs/security/rate-limiting" className="button button--secondary button--sm" style={{borderRadius: '9999px', padding: '8px 18px'}}>
                🛡️ Distributed Rate Limiting
              </Link>
              <Link to="/docs/reference/technical-terms-dictionary" className="button button--secondary button--sm" style={{borderRadius: '9999px', padding: '8px 18px'}}>
                📚 Terms Dictionary (සිංහල)
              </Link>
              <Link to="/docs/engineering-timeline/daily-timeline" className="button button--secondary button--sm" style={{borderRadius: '9999px', padding: '8px 18px'}}>
                📅 Engineering Timeline
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="container" style={{paddingBottom: '4rem'}}>
          <div className="cardGrid">
            <Link to="/docs/logging-audit/dual-plane-architecture" className="modernCard">
              <span className="modernCardBadge">Architecture Redesign</span>
              <h3 className="modernCardTitle">Dual-Plane Logging Engine</h3>
              <p className="modernCardDesc">
                Isolates high-frequency debug traces in 5GB local rolling files while keeping legally-binding clinical and financial audits in PostgreSQL with Cloudflare R2 WORM cold archival.
              </p>
            </Link>

            <Link to="/docs/logging-audit/task-roadmap-and-progress" className="modernCard">
              <span className="modernCardBadge">Live Slices</span>
              <h3 className="modernCardTitle">LOG-01 to LOG-10 Roadmap</h3>
              <p className="modernCardDesc">
                Live delivery status for hash-chain serialization (LOG-02), 401 HikariCP DoS defense (LOG-03), BRIN index tuning (LOG-04), and cold JSONL.gz archiver (LOG-05).
              </p>
            </Link>

            <Link to="/docs/reference/technical-terms-dictionary" className="modernCard">
              <span className="modernCardBadge">Glossary & Sinhala</span>
              <h3 className="modernCardTitle">Technical Terms Dictionary</h3>
              <p className="modernCardDesc">
                Every difficult concept—Virtual Threads, HikariCP pool exhaustion, BRIN indexes, GIN deconstruction, and WORM storage—explained in crystal-clear Sinhala and English.
              </p>
            </Link>

            <Link to="/docs/security/rate-limiting" className="modernCard">
              <span className="modernCardBadge">DDoS Protection</span>
              <h3 className="modernCardTitle">Multi-Tier Rate Limiting</h3>
              <p className="modernCardDesc">
                Four-layer Bucket4j token bucket architecture backed by Redis CAS, with an automatic fail-open safety rule to ensure active clinical video consultations are never severed.
              </p>
            </Link>

            <Link to="/docs/clinical/livekit-webrtc" className="modernCard">
              <span className="modernCardBadge">Telehealth Media</span>
              <h3 className="modernCardTitle">LiveKit WebRTC Consultation</h3>
              <p className="modernCardDesc">
                Dynamic encrypted peer room provisioning, mid-call extension signaling (15m/30m/45m), and automated subscription credit settlement.
              </p>
            </Link>

            <Link to="/docs/financial/payhere-webhook-idempotency" className="modernCard">
              <span className="modernCardBadge">Payments & Escrow</span>
              <h3 className="modernCardTitle">PayHere Idempotency & Escrow</h3>
              <p className="modernCardDesc">
                MD5 signature verification, duplicate webhook deduplication, and doctor wallet escrow custody ensuring funds release only upon consultation completion.
              </p>
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}
