// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Nantral Platform Docs",
  tagline: "The offical documentation of Nantral Platform!",
  url: "https://docs.nantral-platform.fr",
  baseUrl: "/",
  trailingSlash: true,
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/logo.svg",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "nantral-platform", // Usually your GitHub org/user name.
  projectName: "nantralPlatform", // Usually your repo name.
  deploymentBranch: "gh-pages",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/3cn-ecn/nantralPlatform/tree/master/docs/",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/3cn-ecn/nantralPlatform/tree/master/docs/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Nantral Platform Docs",
        logo: {
          alt: "Nantral Platform logo",
          src: "img/logo.svg",
        },
        items: [
          {
            to: "/docs/user",
            label: "User Docs",
            position: "left",
          },
          {
            to: "/docs/dev",
            label: "Dev Docs",
            position: "left",
          },
          {
            to: "/blog",
            label: "Blog",
            position: "left",
          },
          {
            href: "https://nantral-platform.fr/",
            label: "Website",
            position: "right",
          },
          {
            href: "https://github.com/3cn-ecn/nantralPlatform",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Documentation",
            items: [
              {
                label: "User Docs",
                to: "/docs/user",
              },
              {
                label: "Dev Docs",
                to: "/docs/dev",
              },
              {
                label: "Blog",
                to: "/blog",
              }
            ],
          },
          {
            title: "Dev tools",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/3cn-ecn/nantralPlatform",
              },
              {
                label: "SonarCloud",
                href: "https://sonarcloud.io/organizations/3cn-ecn",
              },
              {
                label: "Staging Server",
                href: "https://dev.nantral-platform.fr",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Facebook",
                href: "https://www.facebook.com/nantral.platform.ecn",
              },
              {
                label: "Discord",
                href: "https://discord.gg/BH42GYNZ8Z",
              },
              {
                label: "Nantral Platform",
                href: "https://nantral-platform.fr/club/nantral-platform/",
              },
            ],
          },
        ],
        copyright: `A project from 3CN, the dev club of Centrale Nantes. ©${new Date().getFullYear()} 3CN-AECN`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
