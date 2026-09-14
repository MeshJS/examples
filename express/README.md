# Mesh + Express: Cardano Wallet in a Node.js Server

A minimal [Express](https://expressjs.com/) server that uses the [Mesh SDK](https://meshjs.dev/) to work with a Cardano wallet on the backend. Use it as a starting point for APIs that derive addresses, build transactions or sign server-side.

## What it does

`src/index.ts` starts an Express server on port 3000. When you request `GET /`, it creates a headless `MeshWallet` from a mnemonic and responds with the wallet's change address on the testnet (`networkId: 0`).

```ts
const wallet = new MeshWallet({
  networkId: 0,
  key: { type: "mnemonic", words: [/* 24 words */] },
});

const address = await wallet.getChangeAddress();
```

No blockchain provider is needed, because deriving an address happens locally.

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | What it does |
| ------ | ------------ |
| `npm run dev` | Start the server with `ts-node` |
| `npm run clean` | Remove `dist`, `node_modules` and `package-lock.json` |

## Next steps

- Replace the test mnemonic with your own. The `solution` × 24 mnemonic is public; never use it on mainnet.
- Add a provider such as `BlockfrostProvider` to fetch UTxOs and submit transactions. See [MeshWallet](https://meshjs.dev/apis/wallets/meshwallet).
- Build transactions with [MeshTxBuilder](https://meshjs.dev/apis/txbuilder).

## Tech stack

Express 4, TypeScript, ts-node, `@meshsdk/core`.
