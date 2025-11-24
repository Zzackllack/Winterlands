import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://winterlands.example.com",
  output: "static",

  integrations: [
    react({
      include: ["**/components/**/*.tsx", "**/islands/**/*.tsx"],
    }),
    mdx(),
  ],

  markdown: {
    gfm: true,
    smartypants: false,
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
