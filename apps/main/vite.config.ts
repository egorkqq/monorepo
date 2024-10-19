import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import tsconfigPaths from "vite-tsconfig-paths";

import tailwindcss from "tailwindcss";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl({
      /** name of certification */
      name: "test",
      /** custom trust domains */
      domains: ["*.local"],
      /** custom certification directory */
      certDir: "./cert",
    }),
    nodePolyfills(),
    tsconfigPaths(),
  ],

  server: {
    host: "architecton.local",
    port: 1111,
    proxy: {
      "/api": {
        target: "https://tonb.architecton.site",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
});
