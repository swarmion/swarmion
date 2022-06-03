// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const lightCodeTheme = require('prism-react-renderer/themes/github');
const path = require('path');

/** @type {import('@docusaurus/types').Config} */
const config = {
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
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/swarmion/swarmion/tree/main/user-docs/documentation',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'references',
        path: 'references',
        routeBasePath: 'references',
        sidebarPath: require.resolve('./sidebars.js'),
        editUrl:
          'https://github.com/swarmion/swarmion/tree/main/user-docs/documentation',
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
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
        copyright: `Copyright © ${new Date().getFullYear()} Swarmion.`,
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
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      algolia: {
        // The application ID provided by Algolia
        appId: 'VEO1D7F20Z',
        // Public API key: it is safe to commit it
        apiKey: 'b04115598a45a9d171873757c40344dc',
        indexName: 'swarmion',
        searchPagePath: 'search',
      },
    }),
  plugins: [
    [
      'docusaurus-plugin-typedoc-api',
      {
        projectRoot: path.join(__dirname, '../..'),
        packages: ['packages/serverless-contracts'],
        debug: true,
        readmes: true,
        tsconfigName: 'packages/serverless-contracts/tsconfig.json',
      },
    ],
  ],
};

module.exports = config;
