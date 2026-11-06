import React from 'react';
import Layout from '@theme/Layout';
import { ExternalLink, Download, BookOpen } from 'lucide-react';

export default function ApiDocsPage(): React.JSX.Element {
  return (
    <Layout
      title="HITHA REST API Reference"
      description="Interactive Scalar API Documentation for HITHA Healthcare Platform"
      noFooter
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', width: '100%' }}>
        {/* Scalar Header Banner */}
        <div style={{
          padding: '8px 20px',
          background: '#071520',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#ffffff',
          fontSize: '13px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 700, letterSpacing: '0.04em', color: '#54cbd4' }}>SCALAR API REFERENCE</span>
            <span style={{ color: '#64748b' }}>•</span>
            <span style={{ color: '#94a3b8' }}>OpenAPI 3.1 Specification</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a
              href="/openapi.json"
              download="hitha-openapi.json"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#94a3b8',
                textDecoration: 'none',
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Spec</span>
            </a>

            <a
              href="https://registry.scalar.com/@default-team-ljng5/apis/hitha-api-documentation@1.0.0"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#ffffff',
                background: '#2160fd',
                textDecoration: 'none',
                fontSize: '12px',
                fontWeight: 600,
                padding: '4px 12px',
                borderRadius: '6px',
              }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Scalar Cloud Registry</span>
            </a>
          </div>
        </div>

        {/* Embedded Scalar Interactive Docs */}
        <iframe
          src="/scalar.html"
          title="Hitha Scalar API Documentation"
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            border: 'none',
            background: '#ffffff',
          }}
        />
      </div>
    </Layout>
  );
}
