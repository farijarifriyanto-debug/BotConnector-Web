// @ts-check
import { defineConfig } from 'astro/config';

import starlight from '@astrojs/starlight';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://farijarifriyanto-debug.github.io',
  base: '/BotConnector-Website',
  integrations: [
    starlight({
      title: 'BotConnector Docs',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/farijarifriyanto-debug/BotConnector-Core' },
      ],
      sidebar: [
        {
          label: 'Guides',
          items: [
            { label: 'Overview', slug: 'docs/overview' },
            { label: 'Installation', slug: 'docs/installation' },
            { label: 'FAQ', slug: 'docs/faq' },
          ],
        },
      ],
    }),
    sitemap(),
  ],
});
