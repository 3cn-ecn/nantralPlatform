import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import docusaurusSearchLocal from '@easyops-cn/docusaurus-search-local';
import { themes as prismThemes } from 'prism-react-renderer';

const config: Config = {
  title: 'Nantral Platform Docs',
  tagline: 'The offical documentation of Nantral Platform!',
  favicon: 'img/logo.svg',
  url: 'https://docs.nantral-platform.fr',
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'nantral-platform',
  projectName: 'nantralPlatform',
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  plugins: ['docusaurus-plugin-sass'],
  themes: [
    [
      docusaurusSearchLocal,
      { hashed: true, docsRouteBasePath: '/', indexPages: true },
    ],
  ],

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
          routeBasePath: '/',
          editUrl:
            'https://github.com/3cn-ecn/nantralPlatform/tree/master/docs/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/3cn-ecn/nantralPlatform/tree/master/docs/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/np-background.png',
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: 'Nantral Platform Docs',
      logo: {
        alt: 'Nantral Platform logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: '/user',
          label: 'User Docs',
          position: 'left',
        },
        {
          to: '/dev',
          label: 'Dev Docs',
          position: 'left',
        },
        {
          to: '/blog',
          label: 'Blog',
          position: 'left',
        },
        {
          href: 'https://nantral-platform.fr/',
          label: 'Website',
          position: 'right',
        },
        {
          href: 'https://github.com/3cn-ecn/nantralPlatform',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'User Docs',
              to: '/user',
            },
            {
              label: 'Dev Docs',
              to: '/dev',
            },
            {
              label: 'Blog',
              to: '/blog',
            },
          ],
        },
        {
          title: 'Dev tools',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/3cn-ecn/nantralPlatform',
            },
            {
              label: 'SonarCloud',
              href: 'https://sonarcloud.io/organizations/3cn-ecn',
            },
            {
              label: 'Staging Server',
              href: 'https://dev.nantral-platform.fr',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Facebook',
              href: 'https://www.facebook.com/nantral.platform.ecn',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/BH42GYNZ8Z',
            },
            {
              label: 'Nantral Platform',
              href: 'https://nantral-platform.fr/group/@3cn',
            },
          ],
        },
      ],
      copyright: `A project from 3CN, the dev club of Centrale Nantes. ©${new Date().getFullYear()} 3CN-AECN`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: [
        'bash',
        'powershell',
        'json',
        'javascript',
        'typescript',
        'diff',
      ],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
