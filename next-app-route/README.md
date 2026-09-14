# Mesh + Next.js App Router: Cardano dApp Starter

A minimal [Next.js](https://nextjs.org/docs/app) App Router project that uses the [Mesh SDK](https://meshjs.dev/) to create a Cardano wallet in the browser.

## What it does

`src/app/page.tsx` is a client component (`"use client"`) with a **Get Address** button. Clicking it creates a headless `MeshWallet` from a mnemonic, connected to a `BlockfrostProvider`, and shows the wallet's change address.

```tsx
const blockchainProvider = new BlockfrostProvider("API_KEY");
const wallet = new MeshWallet({
  networkId: 0, // 0: testnet, 1: mainnet
  fetcher: blockchainProvider,
  submitter: blockchainProvider,
  key: { type: "mnemonic", words },
});

const address = await wallet.getChangeAddress();
```

The page is a client component because it handles a button click. `MeshWallet` also works in server code, as the [express](../express) example shows.

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | What it does |
| ------ | ------------ |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Configuration

- Replace `"API_KEY"` with your [Blockfrost](https://blockfrost.io/) preprod project ID to fetch UTxOs or submit transactions.
- Replace the test mnemonic with your own. The `solution` × 24 mnemonic is public; never use it on mainnet.

## Next steps

- Add a wallet connect button with [@meshsdk/react](https://meshjs.dev/react). It is already installed; see the [next-page-route](../next-page-route) example for usage.
- Build and submit transactions with [MeshTxBuilder](https://meshjs.dev/apis/txbuilder).

## Tech stack

Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, `@meshsdk/core`, `@meshsdk/react`.
