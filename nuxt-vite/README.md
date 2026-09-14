# Mesh + Nuxt 3 (Vite): Cardano Browser Wallet Example

A [Nuxt 3](https://nuxt.com/) app that uses the [Mesh SDK](https://meshjs.dev/) to connect a Cardano browser wallet and display its address, ADA balance and assets.

## What it does

`app.vue` uses Mesh's `BrowserWallet`:

1. Lists every CIP-30 wallet extension installed in the browser with `BrowserWallet.getInstalledWallets()`.
2. Connects to the one you click with `BrowserWallet.enable(name)`.
3. Shows the wallet's change address, lovelace balance and native assets.

```ts
import { BrowserWallet } from "@meshsdk/core";

const installedWallets = computed(() => BrowserWallet.getInstalledWallets());

const wallet = await BrowserWallet.enable(walletName);
const [assets, address, lovelace] = await Promise.all([
  wallet.getAssets(),
  wallet.getChangeAddress(),
  wallet.getLovelace(),
]);
```

## Configuring Vite for Mesh

Mesh uses WebAssembly and Node.js built-ins, so `nuxt.config.ts` adds three Vite plugins and turns off server-side rendering:

```ts
import { nodePolyfills } from "vite-plugin-node-polyfills";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

export default defineNuxtConfig({
  ssr: false,
  vite: {
    plugins: [
      wasm(),
      topLevelAwait(),
      nodePolyfills({ globals: { Buffer: true, global: true }, protocolImports: true }),
    ],
    define: { global: "globalThis" },
  },
});
```

Copy this setup into any Nuxt or Vite project that uses Mesh.

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You need a Cardano browser wallet extension installed.

| Script | What it does |
| ------ | ------------ |
| `npm run dev` | Start the development server |
| `npm run clean` | Remove `.nuxt`, `dist`, `.vite`, `node_modules` and `package-lock.json` (run `npm install` again afterwards) |

## Tech stack

Nuxt 3, Vue 3, Vite, `@meshsdk/core`.
