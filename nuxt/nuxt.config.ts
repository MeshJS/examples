import { nodePolyfills } from "vite-plugin-node-polyfills";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  vite: {
    plugins: [
      wasm(),
      topLevelAwait(),
      nodePolyfills({
        globals: { Buffer: true, global: true },
        protocolImports: true,
      }),
    ],

    define: {
      global: "globalThis",
    },
  },

})
