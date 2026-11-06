import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import { 
  Layers, 
  Smartphone, 
  Globe, 
  Code2, 
  ChevronDown, 
  Sparkles, 
  Package, 
  Cpu, 
  ArrowRight,
  Shield,
  Stethoscope,
  Terminal,
  Activity
} from 'lucide-react';

export default function MegaDropdownSDKs(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<'web' | 'mobile'>('web');

  return (
    <div className="navbar__item dropdown dropdown--hoverable mega-dropdown-wrapper">
      <Link to="/docs/clinical/livekit-webrtc" className="navbar__link mega-dropdown-trigger" role="button">
        <span>SDKs</span>
        <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-70" />
      </Link>

      <div className="dropdown__menu mega-dropdown-panel">
        {/* Top Context Selector Row */}
        <div className="mega-dropdown-top-selector">
          <button 
            type="button" 
            className={`mega-selector-btn ${activeTab === 'web' ? 'active' : ''}`}
            onMouseEnter={() => setActiveTab('web')}
            onClick={() => setActiveTab('web')}
          >
            <div className="mega-btn-icon web">
              <Globe className="w-4 h-4" />
            </div>
            <div className="mega-btn-text">
              <span className="mega-btn-title">Web SDKs</span>
              <span className="mega-btn-sub">React, Next.js, Angular, Vanilla JS</span>
            </div>
          </button>

          <button 
            type="button" 
            className={`mega-selector-btn ${activeTab === 'mobile' ? 'active' : ''}`}
            onMouseEnter={() => setActiveTab('mobile')}
            onClick={() => setActiveTab('mobile')}
          >
            <div className="mega-btn-icon mobile">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="mega-btn-text">
              <span className="mega-btn-title">Mobile SDKs</span>
              <span className="mega-btn-sub">Flutter, React Native, iOS, Android</span>
            </div>
          </button>
        </div>

        {/* Lower Two-Column Grid: Core Engine vs UI Kit */}
        <div className="mega-dropdown-grid">
          {/* Column 1: Core Engine */}
          <div className="mega-col">
            <div className="mega-col-header">
              <span className="mega-col-badge">Core Engine</span>
              <h4 className="mega-col-title">Telehealth &amp; WebRTC Engine</h4>
              <p className="mega-col-desc">Low-latency audio/video, track controls, and mid-call extensions.</p>
            </div>

            <div className="mega-links-list">
              <Link to="/docs/clinical/livekit-webrtc" className="mega-link-item">
                <Activity className="w-4 h-4 text-cyan-400" />
                <div>
                  <span className="mega-item-name">LiveKit WebRTC Core</span>
                  <span className="mega-item-tag">15m, 30m, 45m Extensions</span>
                </div>
              </Link>

              <Link to="/docs/clinical/on-demand-queue" className="mega-link-item">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="mega-item-name">On-Demand Dispatch Engine</span>
                  <span className="mega-item-tag">Pessimistic Row Lock</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Column 2: UI Kit & Prescriptions */}
          <div className="mega-col">
            <div className="mega-col-header">
              <span className="mega-col-badge ui">Clinical UI Kit</span>
              <h4 className="mega-col-title">Consultation Components</h4>
              <p className="mega-col-desc">Ready-to-use patient lobby, doctor video canvas, and E-Prescriptions.</p>
            </div>

            <div className="mega-links-list">
              <Link to="/docs/clinical/prescriptions-catalog" className="mega-link-item">
                <Stethoscope className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="mega-item-name">Drug Formulary &amp; Rx</span>
                  <span className="mega-item-tag">Zero-PHI Compliance</span>
                </div>
              </Link>

              <Link to="/docs/security/rate-limiting" className="mega-link-item">
                <Shield className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="mega-item-name">Fail-Open Clinical Guard</span>
                  <span className="mega-item-tag">Bucket4j Token Buckets</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
