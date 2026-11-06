import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'HITHA Architecture & Engineering Portal',
  tagline: 'Enterprise Telehealth System Architecture, Logging, Rate Limiting & Technical Glossary',
  favicon: 'img/favicon.ico',

  url: 'https://docs.hitha.lk',
  baseUrl: '/',

  organizationName: 'hitha-health',
  projectName: 'hitha-docs',

  onBrokenLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/docs',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        docsRouteBasePath: '/docs',
      },
    ],
  ],

  themeConfig: {
    image: 'img/hitha-social-card.jpg',
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'HITHA Architecture',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/yasasbanukaofficial/hitha-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Architecture',
          items: [
            {label: 'Overview & Principles', to: '/docs/'},
            {label: 'Dual-Plane Logging', to: '/docs/logging-audit/dual-plane-architecture'},
            {label: 'Distributed Rate Limiting', to: '/docs/security/rate-limiting'},
          ],
        },
        {
          title: 'Dictionary & Reference',
          items: [
            {label: 'Technical Terms (සිංහල & English)', to: '/docs/reference/technical-terms-dictionary'},
            {label: 'Engineering Timeline', to: '/docs/engineering-timeline/daily-timeline'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} HITHA Healthcare Platform. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['java', 'bash', 'yaml', 'json', 'sql'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
