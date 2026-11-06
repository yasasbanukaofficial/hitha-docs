import React from 'react';
import Link from '@docusaurus/Link';
import { Shield, Lock, FileCheck, ExternalLink, Github, Heart } from 'lucide-react';

export default function CustomFooter(): React.JSX.Element {
  return (
    <footer className="dyte-footer">
      <div className="dyte-footer-container">
        {/* Top Compliance Row */}
        <div className="footer-compliance-row">
          <div className="footer-compliance-brand">
            <span className="compliance-shield-icon">🛡️</span>
            <div>
              <h4 className="compliance-title">Your Clinical Security, Our Architecture Priority</h4>
              <p className="compliance-desc">Compliant with Sri Lankan Medical Ordinance, PDPA, and global HIPAA standards.</p>
            </div>
          </div>

          <div className="compliance-badges-grid">
            <div className="compliance-badge">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>PDPA Compliant</span>
            </div>
            <div className="compliance-badge">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>7-Yr WORM Archival</span>
            </div>
            <div className="compliance-badge">
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero-PHI Audit Logs</span>
            </div>
          </div>
        </div>

        <hr className="footer-divider" />

        {/* Links Grid */}
        <div className="footer-links-grid">
          <div className="footer-col">
            <span className="footer-col-title">Architecture Pillars</span>
            <ul className="footer-links-list">
              <li><Link to="/docs/logging-audit/dual-plane-architecture">Dual-Plane Logging</Link></li>
              <li><Link to="/docs/security/rate-limiting">Bucket4j Rate Limiting</Link></li>
              <li><Link to="/docs/clinical/livekit-webrtc">LiveKit WebRTC Media</Link></li>
              <li><Link to="/docs/financial/doctor-wallet-escrow">Escrow Custody Ledger</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">Engineering Progress</span>
            <ul className="footer-links-list">
              <li><Link to="/docs/logging-audit/task-roadmap-and-progress">LOG-01 to LOG-10 Roadmap</Link></li>
              <li><Link to="/docs/engineering-timeline/daily-timeline">Daily Timeline (Nov 06, 2026)</Link></li>
              <li><Link to="/docs/logging-audit/deep-technical-mechanisms">Deep Mechanism Q&amp;A</Link></li>
              <li><Link to="/docs/reference/technical-terms-dictionary">Architecture Glossary</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">Infrastructure &amp; DB</span>
            <ul className="footer-links-list">
              <li><Link to="/docs/reference/database-indexing-optimization">PostgreSQL BRIN Optimization</Link></li>
              <li><Link to="/docs/reference/caching-architecture">Redis Distributed Caching</Link></li>
              <li><Link to="/docs/reference/transactional-outbox-pattern">Transactional Outbox &amp; DLQ</Link></li>
              <li><Link to="/docs/reference/background-schedulers">Distributed Schedulers</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">Clinical Compliance</span>
            <ul className="footer-links-list">
              <li><Link to="/docs/clinical/prescriptions-catalog">Drug Catalog &amp; Zero-PHI</Link></li>
              <li><Link to="/docs/security/rbac-superadmin">RBAC &amp; Pseudonymous Pointers</Link></li>
              <li><Link to="/docs/financial/payhere-webhook-idempotency">PayHere Idempotency</Link></li>
              <li><Link to="/docs/security/sse-token-refresh">SSE Real-Time Handshake</Link></li>
            </ul>
          </div>
        </div>

        <hr className="footer-divider" />

        {/* Bottom Legal & Copyright Bar */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright">
            <span>© {new Date().getFullYear()} HITHA Healthcare Distributed Platform. All engineering specifications reserved.</span>
          </div>

          <div className="footer-developer-meta">
            <span>Restricted Internal Access • Spring Boot 3.3 • Java 21 Virtual Threads</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
