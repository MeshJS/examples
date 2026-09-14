# Mesh + Next.js Pages Router: Cardano Wallet Connect Starter

A [Next.js](https://nextjs.org/) Pages Router starter for Cardano dApps, with a ready-made wallet connect button from [@meshsdk/react](https://meshjs.dev/react).

## What it does

- `src/pages/_app.tsx` wraps the app in `MeshProvider` and imports the Mesh React styles.
- `src/pages/index.tsx` renders the `CardanoWallet` connect button, which lets users connect a CIP-30 browser wallet, plus links to the Mesh docs, guides and smart contracts.

```tsx
// _app.tsx
import "@meshsdk/react/styles.css";
import { MeshProvider } from "@meshsdk/react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MeshProvider>
      <Component {...pageProps} />
    </MeshProvider>
  );
}
```

```tsx
// index.tsx
import { CardanoWallet, MeshBadge } from "@meshsdk/react";

<CardanoWallet isDark />
```

Once a wallet is connected, use the `useWallet` hook from `@meshsdk/react` anywhere inside `MeshProvider` to read the wallet and sign transactions.

## Run it

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You need a Cardano browser wallet extension installed to connect.

| Script | What it does |
| ------ | ------------ |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Next steps

- Explore the [React components and hooks](https://meshjs.dev/react).
- Build and submit transactions with [MeshTxBuilder](https://meshjs.dev/apis/txbuilder).
- Scaffold a new project with this setup using `npx meshjs your-app-name`.

## Tech stack

Next.js 15 (Pages Router), React 18, TypeScript, Tailwind CSS, `@meshsdk/core`, `@meshsdk/react`.
