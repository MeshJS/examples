# Aiken Hello World: Your First Cardano Smart Contract with Mesh

A complete, beginner-friendly Cardano smart contract. The on-chain validator is written in [Aiken](https://aiken-lang.org/) (Plutus V3), and the off-chain code uses the [Mesh SDK](https://meshjs.dev/) to lock and unlock ADA on the preprod testnet.

The contract has two rules. To unlock the funds, a transaction must:

1. Be signed by the **owner** whose key hash is stored in the datum.
2. Provide the redeemer message **"Hello, World!"**.

## On-chain code

The validator lives in [`aiken-workspace/validators/hello-world.ak`](./aiken-workspace/validators/hello-world.ak):

```aiken
use aiken/collection/list
use aiken/crypto.{VerificationKeyHash}
use cardano/transaction.{OutputReference, Transaction}

pub type Datum {
  owner: VerificationKeyHash,
}

pub type Redeemer {
  msg: ByteArray,
}

validator hello_world {
  spend(
    datum_opt: Option<Datum>,
    redeemer: Redeemer,
    _input: OutputReference,
    tx: Transaction,
  ) {
    expect Some(datum) = datum_opt
    let must_say_hello = redeemer.msg == "Hello, World!"
    let must_be_signed = list.has(tx.extra_signatories, datum.owner)
    must_say_hello && must_be_signed
  }

  else(_) {
    fail
  }
}
```

### Why the datum and redeemer hold what they do

In Cardano's eUTxO model, the **datum** is attached when funds are locked, so it acts as configuration fixed at lock time. Storing the `owner` there means the locker decides up front who may unlock.

The **redeemer** is supplied by whoever tries to spend, so it carries the spender's input. The `msg` belongs there because it is something the unlocker must prove they know at spend time.

### Test the validator

The file includes three tests: a successful unlock, a wrong redeemer message, and a missing owner signature. With the [Aiken CLI](https://aiken-lang.org/installation-instructions) installed:

```bash
cd aiken-workspace
aiken check   # run tests
aiken build   # compile to plutus.json (CIP-57 blueprint)
```

A compiled `plutus.json` is already committed, so you only need Aiken if you change the contract.

## Off-chain code

The TypeScript in [`src/`](./src) loads the compiled script from `plutus.json`.

### Lock ADA

[`src/lock-assets.ts`](./src/lock-assets.ts) sends 10 ADA to the script address, with the wallet's public key hash as the datum:

```ts
const { utxos, walletAddress } = await getWalletInfoForTx();
const { scriptAddr } = getScript(blueprint.validators[0].compiledCode);
const signerHash = deserializeAddress(walletAddress).pubKeyHash;

await txBuilder
  .txOut(scriptAddr, assets)
  .txOutDatumHashValue(mConStr0([signerHash]))
  .changeAddress(walletAddress)
  .selectUtxosFrom(utxos)
  .complete();
```

The datum is attached as a hash, so the unlock transaction must provide the full datum value.

### Unlock ADA

[`src/unlock-assets.ts`](./src/unlock-assets.ts) asks for the lock transaction hash, then spends the script output with the "Hello, World!" redeemer and the owner's signature:

```ts
await txBuilder
  .spendingPlutusScript("V3")
  .txIn(scriptUtxo.input.txHash, scriptUtxo.input.outputIndex, scriptUtxo.output.amount, scriptUtxo.output.address)
  .txInScript(scriptCbor)
  .txInRedeemerValue(mConStr0([stringToHex("Hello, World!")]))
  .txInDatumValue(mConStr0([signerHash]))
  .requiredSignerHash(signerHash)
  .changeAddress(walletAddress)
  .txInCollateral(collateral.input.txHash, collateral.input.outputIndex, collateral.output.amount, collateral.output.address)
  .selectUtxosFrom(utxos)
  .complete();
```

Spending from a Plutus script needs collateral, and `requiredSignerHash` puts the owner's key hash into `extra_signatories` so the validator can check it.

## Run it

This example imports a shared helper from the repository's root `common/` folder, so clone the whole repo.

1. Install dependencies:

   ```bash
   cd aiken-hello-world
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in:

   ```bash
   BLOCKFROST_API_KEY=preprodxxxxxxxx
   MNEMONIC="word1,word2,...,word24"
   ```

   Use a [Blockfrost](https://blockfrost.io/) **preprod** project ID and a comma-separated testnet mnemonic.

3. Fund the wallet with test ADA from the [faucet](https://docs.cardano.org/cardano-testnets/tools/faucet). The scripts require a pure-ADA UTxO of at least 5 ADA to use as collateral.

4. Lock, then unlock:

   ```bash
   npm run lock     # prints the lock transaction hash
   npm run unlock   # paste the hash when prompted
   ```

## Learn more

- [Aiken with Mesh guide](https://meshjs.dev/aiken)
- [Hello World contract demo](https://meshjs.dev/smart-contracts/hello-world)
- [Smart contract transactions with MeshTxBuilder](https://meshjs.dev/apis/txbuilder/smart-contracts)
- [Aiken documentation](https://aiken-lang.org/)
