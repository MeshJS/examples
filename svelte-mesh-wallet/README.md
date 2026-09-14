# Mesh + SvelteKit: Build and Submit a Cardano Transaction

A [SvelteKit](https://svelte.dev/docs/kit) project (Svelte 4) that uses the [Mesh SDK](https://meshjs.dev/) to load a wallet, build a transaction, sign it and submit it to the Cardano preprod testnet.

## What it does

`src/routes/+page.svelte` has a **Load Wallet Build Tx** button. Clicking it:

1. Creates a headless `MeshWallet` from a mnemonic, connected to a `BlockfrostProvider`.
2. Builds a transaction that sends 1 ADA back to the wallet's own address.
3. Signs and submits it, then logs the transaction hash to the browser console.

```ts
const blockchainProvider = new BlockfrostProvider("preprodxxx");
const wallet = new MeshWallet({
  networkId: 0,
  fetcher: blockchainProvider,
  submitter: blockchainProvider,
  key: { type: "mnemonic", words },
});

const changeAddress = await wallet.getChangeAddress();

const tx = new Transaction({ initiator: wallet, verbose: true });
tx.sendLovelace(changeAddress, "1000000");

const unsignedTx = await tx.build();
const signedTx = await wallet.signTx(unsignedTx);
const txHash = await wallet.submitTx(signedTx);
```

This example uses the high-level `Transaction` class. For full control over inputs, outputs and scripts, use [MeshTxBuilder](https://meshjs.dev/apis/txbuilder).

## Configuring Vite for Mesh

Mesh uses WebAssembly and Node.js built-ins, so `vite.config.ts` adds these plugins:

```ts
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    sveltekit(),
    wasm(),
    topLevelAwait(),
    nodePolyfills({ globals: { Buffer: true, global: true }, protocolImports: true }),
  ],
  define: { global: "globalThis" },
});
```

## Run it

1. Replace `"preprodxxx"` in `src/routes/+page.svelte` with your [Blockfrost](https://blockfrost.io/) preprod project ID.
2. Replace the test mnemonic with your own testnet wallet and fund it from the [faucet](https://docs.cardano.org/cardano-testnets/tools/faucet). The `solution` × 24 mnemonic is public; never use it on mainnet.
3. Install and start the app:

```bash
npm install
npm run dev
```

Open the URL Vite prints (by default [http://localhost:5173](http://localhost:5173)), click the button, and check the browser console for the transaction hash.

| Script | What it does |
| ------ | ------------ |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run check` | Type-check with `svelte-check` |
| `npm run lint` | Check formatting and lint |
| `npm run format` | Format with Prettier |

## Tech stack

SvelteKit 2, Svelte 4, Vite 5, TypeScript, Tailwind CSS, `@meshsdk/core`.
