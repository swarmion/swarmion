import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes } from 'prism-react-renderer';

const config: Config = {
  title: 'swarmion',
  tagline: 'Build stable Serverless applications that scale with your team',
  url: 'https://www.swarmion.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo.svg',
  organizationName: 'swarmion',
  projectName: 'swarmion',
  presets: [
    [
      'classic',

      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          editUrl:
            'https://github.com/swarmion/swarmion/tree/main/user-docs/documentation',
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
      '@docusaurus/plugin-content-docs',
      {
        id: 'references',
        path: 'references',
        routeBasePath: 'references',
        sidebarPath: './sidebars.ts',
        editUrl:
          'https://github.com/swarmion/swarmion/tree/main/user-docs/documentation',
      },
    ],
  ],

  themeConfig: {
    colorMode: {
      respectPrefersColorScheme: true,
    },
    image: 'img/social-media-image.png',
    navbar: {
      title: 'swarmion',
      logo: {
        alt: 'Swarmion Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'index',
          position: 'right',
          label: 'Docs',
        },
        {
          to: '/references/',
          label: 'References',
          position: 'right',
          activeBaseRegex: `/references/`,
        },
        {
          href: 'https://github.com/swarmion/swarmion',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `Copyright © 2025 Swarmion.`,
      links: [
        {
          title: 'Acknowledgments',
          items: [
            {
              label: 'Sponsored by Theodo',
              href: 'https://www.theodo.fr',
            },
            {
              label: 'Icons created by Smashicons - Flaticon',
              href: 'https://www.flaticon.com/',
            },
          ],
        },
      ],
    },
    prism: {
      theme: themes.github,
      darkTheme: themes.dracula,
    },
    algolia: {
      // The application ID provided by Algolia
      appId: 'VEO1D7F20Z',
      // Public API key: it is safe to commit it
      apiKey: 'b04115598a45a9d171873757c40344dc',
      indexName: 'swarmion',
      searchPagePath: 'search',
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
