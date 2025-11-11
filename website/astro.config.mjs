import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import swup from '@swup/astro';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://winterlands.example.com',
  output: 'static',

  integrations: [
    react({
      include: ['**/components/**/*.tsx', '**/islands/**/*.tsx'],
    }),
    mdx(),
    swup({
      theme: 'fade',
      animationClass: 'swup-transition-',
      containers: ['#swup'],
      cache: true,
      accessibility: true,
      preload: true,
    }),
  ],

  markdown: {
    gfm: true,
    smartypants: false,
  },

  vite: {
    plugins: [tailwindcss()],
  },
});