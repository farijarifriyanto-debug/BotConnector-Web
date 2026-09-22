// @ts-check
import { defineConfig } from 'astro/config';

import starlight from '@astrojs/starlight';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://farijarifriyanto-debug.github.io/BotConnector-Website',
  integrations: [starlight({ title: 'BotConnector' }), sitemap()]
});