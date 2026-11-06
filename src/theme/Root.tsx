import React, { useState, useEffect } from 'react';
import { Lock, Shield, KeyRound, ArrowRight, UserCheck } from 'lucide-react';

const AUTH_STORAGE_KEY = 'hitha_docs_auth_token_v1';
// Developer Credentials (matches HITHA platform dev credentials)
const DEV_USER = 'hitha-dev';
const DEV_PASS = 'hitha2026';

export default function Root({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Check if auth token exists in localStorage
    try {
      const token = localStorage.getItem(AUTH_STORAGE_KEY);
      if (token === 'authorized_developer_session') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      setIsAuthenticated(true); // SSR fallback
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === DEV_USER && password === DEV_PASS) {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, 'authorized_developer_session');
      } catch (err) {}
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid developer credentials. Please verify your team credentials.');
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (err) {}
    setIsAuthenticated(false);
  };

  // SSR or initial hydration loading state
  if (isAuthenticated === null) {
    return <>{children}</>;
  }

  // If not authenticated, render the Developer Gatekeeper screen
  if (!isAuthenticated) {
    return (
      <div className="auth-gate-root">
        <div className="auth-gate-card">
          <div className="auth-gate-header">
            <div className="auth-icon-badge">
              <Shield className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="auth-gate-title">HITHA Developer Portal</h2>
            <p className="auth-gate-desc">
              Protected engineering &amp; architecture specifications. Restricted to authorized Hitha core engineering staff.
            </p>
          </div>

          <form onSubmit={handleLogin} className="auth-gate-form">
            {errorMsg && (
              <div className="auth-error-banner">
                {errorMsg}
              </div>
            )}

            <div className="auth-field-group">
              <label className="auth-field-label">Developer Username</label>
              <div className="auth-input-wrapper">
                <input
                  type="text"
                  required
                  className="auth-text-input"
                  placeholder="e.g. hitha-dev"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="auth-field-group">
              <label className="auth-field-label">Access Token / Password</label>
              <div className="auth-input-wrapper">
                <input
                  type="password"
                  required
                  className="auth-text-input"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="auth-submit-btn">
              <span>Sign In with Dev Credentials</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          </form>

          <div className="auth-credentials-hint">
            <div className="hint-header">
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              <span>Default Dev Credentials (Internal Only)</span>
            </div>
            <div className="hint-keys">
              <span>Username: <code>hitha-dev</code></span>
              <span>Password: <code>hitha2026</code></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated user gets full site access
  return (
    <>
      <div className="dev-auth-top-strip">
        <div className="dev-auth-strip-content">
          <div className="dev-auth-status">
            <span className="dev-status-indicator"></span>
            <span className="dev-status-text">HITHA Engineering Environment • Authorized Developer Session</span>
          </div>
          <button onClick={handleLogout} className="dev-logout-btn" title="Sign out of developer portal">
            Lock Session
          </button>
        </div>
      </div>
      {children}
    </>
  );
}
