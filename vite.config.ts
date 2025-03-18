import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), sentryVitePlugin({
    org: "lincassable",
    project: "outil-gestion-react"
  })],

  assetsInclude: ["**/mail.html"],

  build: {
    sourcemap: true
  }
});