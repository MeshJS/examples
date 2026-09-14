<div align="center">

# Mesh SDK Examples for Cardano

**Runnable example projects for building Cardano dApps with [Mesh](https://meshjs.dev/), the open-source TypeScript SDK for Cardano.**

[Mesh website](https://meshjs.dev/) · [API docs](https://docs.meshjs.dev/) · [Guides](https://meshjs.dev/guides) · [Mesh SDK repo](https://github.com/MeshJS/mesh) · [Discord](https://discord.gg/dH48jH3BKa)

</div>

This repository collects small, focused examples that show how to use the Mesh SDK (`@meshsdk/core`) in real projects. They cover frontend frameworks (Next.js, SvelteKit, Nuxt), backend servers (Express), standalone Node.js scripts, and end-to-end Aiken smart contracts with off-chain TypeScript code.

Every example is a separate project with its own `package.json`. Pick the one closest to what you are building, install it, and run it.

## Examples

### Smart contracts (Aiken + Mesh)

On-chain validators written in [Aiken](https://aiken-lang.org/) (Plutus V3), with off-chain scripts that lock, unlock and mint on the Cardano preprod testnet.

| Example | What it shows |
| ------- | ------------- |
| [aiken-hello-world](./aiken-hello-world) | Lock ADA in a script and unlock it with the owner's signature and a "Hello, World!" redeemer |
| [aiken-vesting](./aiken-vesting) | Lock funds until a deadline, withdrawable by the owner at any time or by a beneficiary after the deadline |
| [aiken-giftcard](./aiken-giftcard) | Mint a one-shot gift card token that locks assets, then burn the token to redeem them |

### Frontend frameworks

| Example | What it shows |
| ------- | ------------- |
| [next-page-route](./next-page-route) | Next.js (Pages Router) starter with the `@meshsdk/react` Cardano wallet connect button |
| [next-app-route](./next-app-route) | Next.js (App Router) page that creates a headless `MeshWallet` on the client |
| [svelte-starter](./svelte-starter) | SvelteKit (Svelte 5) starter with the `@meshsdk/svelte` wallet connect button |
| [svelte-mesh-wallet](./svelte-mesh-wallet) | SvelteKit (Svelte 4) page that builds, signs and submits a transaction with `MeshWallet` |
| [nuxt-vite](./nuxt-vite) | Nuxt 3 + Vite app that lists installed browser wallets and shows the connected wallet's balance |

### Backend and scripts

| Example | What it shows |
| ------- | ------------- |
| [express](./express) | Express server that derives a Cardano wallet address with `MeshWallet` |
| [run-standalone-files](./run-standalone-files) | Node.js scripts for sending ADA, native scripts, and a local devnet with Yaci DevKit |

## Getting started

Clone the whole repository. Some examples import shared helpers from the root `common/` folder, so copying a single folder on its own may not work.

```bash
git clone https://github.com/MeshJS/examples.git
cd examples/<example-name>
npm install
```

Then follow the README inside that example.

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later and npm
- A [Blockfrost](https://blockfrost.io/) project ID for the **preprod** network, for examples that read from or submit to the blockchain
- Test ADA from the [Cardano testnet faucet](https://docs.cardano.org/cardano-testnets/tools/faucet)
- The [Aiken compiler](https://aiken-lang.org/installation-instructions), only if you want to modify and rebuild the smart contracts

> [!WARNING]
> Several examples use a well-known test mnemonic (`solution` × 24) so they run out of the box. Anyone can spend funds sent to that wallet. Replace it with your own testnet wallet, and never use it on mainnet.

## FAQ

### What is Mesh?

Mesh is an open-source TypeScript SDK for building Cardano dApps. It includes a transaction builder, wallet integrations (CIP-30 browser wallets and headless wallets), blockchain providers, and React and Svelte UI components.

### How do I connect a Cardano wallet in React or Next.js?

Wrap your app in `MeshProvider` and render the `CardanoWallet` component from `@meshsdk/react`. See [next-page-route](./next-page-route).

### How do I use Mesh with Vite, Nuxt or SvelteKit?

Add `vite-plugin-wasm`, `vite-plugin-top-level-await` and `vite-plugin-node-polyfills` to your Vite config. See [nuxt-vite](./nuxt-vite) and [svelte-mesh-wallet](./svelte-mesh-wallet).

### How do I write a Cardano smart contract with Aiken and Mesh?

Write and compile the validator with Aiken, then load the compiled `plutus.json` and build transactions with `MeshTxBuilder`. Start with [aiken-hello-world](./aiken-hello-world).

### Can I test without the public testnet?

Yes. Run a local devnet with Yaci DevKit and connect through `YaciProvider`. See [run-standalone-files](./run-standalone-files).

## Learn more

- [Mesh playground](https://meshjs.dev/apis): live demos of every API
- [Transaction builder](https://meshjs.dev/apis/txbuilder): send assets, mint tokens and interact with smart contracts
- [Aiken with Mesh](https://meshjs.dev/aiken): write and deploy Cardano smart contracts
- [Mesh smart contracts library](https://meshjs.dev/smart-contracts): production-ready contracts with demos
- [Starter templates](https://github.com/MeshJS/mesh-nextjs-template): scaffold a new app with `npx meshjs your-app-name`

## Contributing

Found a broken example or want to add one? Open an [issue](https://github.com/MeshJS/examples/issues) or a pull request. Questions are welcome on [Discord](https://discord.gg/dH48jH3BKa).

## License

Released under the [Apache 2.0 License](./LICENSE).
