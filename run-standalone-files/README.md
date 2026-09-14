# Mesh Standalone Scripts: Cardano Transactions from Node.js

Standalone TypeScript scripts that use the [Mesh SDK](https://meshjs.dev/) to build and submit Cardano transactions from the command line. No framework and no build step: each file runs directly with [tsx](https://tsx.is/).

Use them on the preprod testnet with [Blockfrost](https://blockfrost.io/), or on a local devnet with [Yaci DevKit](https://github.com/bloxbean/yaci-devkit).

## Scripts

| File | Network | What it does |
| ---- | ------- | ------------ |
| [`send-lovelace.ts`](./send-lovelace.ts) | Preprod | Send 1 ADA to an address with the `Transaction` class |
| [`native-script/deposit-assets.ts`](./native-script/deposit-assets.ts) | Preprod | Lock 1.5 ADA in a native script address controlled by your key |
| [`native-script/withdraw-assets.ts`](./native-script/withdraw-assets.ts) | Preprod | Spend the locked UTxO from the native script with `MeshTxBuilder` |
| [`yaci-send-lovelace.ts`](./yaci-send-lovelace.ts) | Yaci devnet | Send 25 ADA and compare the recipient's UTxO count before and after |
| [`yaci-wallet-assets.ts`](./yaci-wallet-assets.ts) | Yaci devnet | Print the wallet address and balance |

Shared helpers live in [`common/`](./common): providers (`BlockfrostProvider`, `YaciProvider`), wallets, and UTxO selection with `keepRelevant`.

> [!WARNING]
> All scripts use the public test mnemonic `solution` × 24, whose address is `addr_test1qpvx0sacufuypa2k4sngk7q40zc5c4npl337uusdh64kv0uafhxhu32dys6pvn6wlw8dav6cmp4pmtv7cc3yel9uu0nq93swx9`. Anyone can spend its funds. Replace the words in `common/get-wallet.ts` and `common/get-wallet-yaci.ts` with your own testnet wallet.

## Run on preprod

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and set your Blockfrost **preprod** project ID:

   ```bash
   BLOCKFROST_API_KEY=preprodxxxx
   ```

3. Fund the wallet from the [Cardano testnet faucet](https://docs.cardano.org/cardano-testnets/tools/faucet).

4. Run a script:

   ```bash
   npx tsx send-lovelace.ts
   ```

### Native script deposit and withdraw

A native script is a simple on-chain rule that needs no Plutus code. Here, [`native-script/get-script.ts`](./native-script/get-script.ts) builds a `sig` script that only your payment key can unlock:

```ts
const hash = resolvePaymentKeyHash(walletAddress);
const script: NativeScript = { type: "sig", keyHash: hash };
const scriptAddr = resolveNativeScriptAddress(script);
```

1. Deposit, and copy the printed transaction hash:

   ```bash
   npx tsx native-script/deposit-assets.ts
   ```

2. Paste that hash into the `txHash` constant in `native-script/withdraw-assets.ts`, then withdraw:

   ```bash
   npx tsx native-script/withdraw-assets.ts
   ```

## Run on a local devnet with Yaci DevKit

[Yaci DevKit](https://devkit.yaci.xyz/) runs a local Cardano devnet with a Blockfrost-compatible API, so you can test without faucets or waiting for testnet blocks. Mesh connects to it through `YaciProvider`:

```ts
import { YaciProvider } from "@meshsdk/core";

const provider = new YaciProvider("http://localhost:8080/api/v1");
```

### 1. Install and start Yaci DevKit

You need [Docker](https://www.docker.com/). Choose one option.

**Option A: npm scripts in this folder.** Download the Docker ZIP distribution from the [Yaci DevKit releases](https://github.com/bloxbean/yaci-devkit/releases) and unzip it into a folder named `yaci/`, so that `yaci/bin/devkit.sh` exists. Then run:

```bash
npm run yaci:start   # runs ./yaci/bin/devkit.sh start
```

**Option B: npm global package.**

```bash
npm install -g @bloxbean/yaci-devkit
yaci-devkit up --enable-yaci-store
```

### 2. Create a node and fund the wallet

In the Yaci CLI prompt, start a single-node devnet:

```bash
yaci-cli> create-node -o --start
```

When the node is running, top up the example wallet with test ADA:

```bash
devnet:default> topup addr_test1qpvx0sacufuypa2k4sngk7q40zc5c4npl337uusdh64kv0uafhxhu32dys6pvn6wlw8dav6cmp4pmtv7cc3yel9uu0nq93swx9 2000
```

### 3. Run the scripts

In a new terminal, from this folder:

```bash
npx tsx yaci-wallet-assets.ts
npx tsx yaci-send-lovelace.ts
```

### 4. Stop Yaci DevKit

```bash
npm run yaci:stop    # Option A
```

For Option B, exit the Yaci CLI.

### Useful local URLs

| Service | URL |
| ------- | --- |
| Yaci Viewer (block explorer) | http://localhost:5173 |
| Yaci Store API | http://localhost:8080/api/v1/ |
| Swagger UI | http://localhost:8080/swagger-ui/index.html |

## Learn more

- [Mesh transaction builder](https://meshjs.dev/apis/txbuilder)
- [MeshWallet](https://meshjs.dev/apis/wallets/meshwallet)
- [Yaci provider for Mesh](https://meshjs.dev/providers/yaci)
- [Yaci DevKit documentation](https://devkit.yaci.xyz/)
