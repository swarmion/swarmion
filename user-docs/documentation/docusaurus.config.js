// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Swarmion',
  tagline: 'A Framework for Serverless Typescript Microservices',
  url: 'https://www.swarmion.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/apitherapy-small.png',
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
        id: 'getting-started',
        path: 'getting-started',
        routeBasePath: 'getting-started',
        sidebarPath: require.resolve('./sidebars.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'how-to',
        path: 'how-to',
        routeBasePath: 'how-to',
        sidebarPath: require.resolve('./sidebars.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'explanations',
        path: 'explanations',
        routeBasePath: 'explanations',
        sidebarPath: require.resolve('./sidebars.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'references',
        path: 'references',
        routeBasePath: 'references',
        sidebarPath: require.resolve('./sidebars.js'),
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true,
      },
      image: 'img/apitherapy.png',
      navbar: {
        title: 'Swarmion',
        logo: {
          alt: 'Swarmion Logo',
          src: 'img/apitherapy.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'index',
            position: 'left',
            label: 'Documentation',
          },
          // {
          //   to: '/getting-started/',
          //   label: 'Getting started',
          //   position: 'left',
          //   activeBaseRegex: `/getting-started/`,
          // },
          // {
          //   to: '/how-to/',
          //   label: 'User guides',
          //   position: 'left',
          //   activeBaseRegex: `/how-to/`,
          // },
          // {
          //   to: '/explanations/',
          //   label: 'Explanations',
          //   position: 'left',
          //   activeBaseRegex: `/explanations/`,
          // },
          // {
          //   to: '/references/',
          //   label: 'References',
          //   position: 'left',
          //   activeBaseRegex: `/references/`,
          // },
          {
            href: 'https://github.com/swarmion/swarmion',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} Swarmion.`,
        links: [
          {
            html: `<a href="https://www.flaticon.com/" title="icons">Icons created by Smashicons - Flaticon</a>`,
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
};

module.exports = config;
