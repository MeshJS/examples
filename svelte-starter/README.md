# Mesh + SvelteKit: Cardano Wallet Connect Starter

A [SvelteKit](https://svelte.dev/docs/kit) starter (Svelte 5) for Cardano dApps, with a ready-made wallet connect button from [@meshsdk/svelte](https://meshjs.dev/svelte).

## What it does

- `src/routes/+layout.svelte` imports the Mesh Svelte styles.
- `src/routes/+page.svelte` renders the `CardanoWallet` connect button, shows which wallet is connected, and logs the wallet's change address using a Svelte 5 `$effect`.

```svelte
<script lang="ts">
  import { CardanoWallet, BrowserWalletState } from "@meshsdk/svelte";

  $effect(() => {
    if (BrowserWalletState.wallet) {
      BrowserWalletState.wallet.getChangeAddress().then((addr) => {
        console.log(addr);
      });
    }
  });
</script>

<CardanoWallet isDark={true} />

{#if BrowserWalletState.connected}
  <p>Browser Wallet {BrowserWalletState.name} is connected!</p>
{/if}
```

`BrowserWalletState` is reactive, so your components update when the user connects or disconnects a wallet.

## Run it

```bash
npm install
npm run dev
```

Open the URL Vite prints (by default [http://localhost:5173](http://localhost:5173)). You need a Cardano browser wallet extension installed to connect.

| Script | What it does |
| ------ | ------------ |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run check` | Type-check with `svelte-check` |

## Configuring Vite for Mesh

Mesh uses WebAssembly and Node.js built-ins, so `vite.config.ts` adds `vite-plugin-wasm`, `vite-plugin-top-level-await` and `vite-plugin-node-polyfills`. Copy that file into your own SvelteKit project when adding Mesh.

## Next steps

- Explore the [Svelte components](https://meshjs.dev/svelte).
- Build and submit transactions with [MeshTxBuilder](https://meshjs.dev/apis/txbuilder).

## Tech stack

SvelteKit 2, Svelte 5, Vite 5, TypeScript, Tailwind CSS, `@meshsdk/core`, `@meshsdk/svelte`.
