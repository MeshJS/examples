# Aiken Gift Card: One-Shot Minting Smart Contract on Cardano with Mesh

A gift card smart contract for Cardano. Creating a gift card locks assets in a script and mints a unique token; burning that token redeems the locked assets. The on-chain validators are written in [Aiken](https://aiken-lang.org/) (Plutus V3), and the off-chain code uses the [Mesh SDK](https://meshjs.dev/) on the preprod testnet.

Whoever holds the gift card token can redeem it, so a gift card can be sent to anyone, like a bearer voucher.

## How it works

The contract is made of two parameterized validators in [`aiken-workspace/validators/oneshot.ak`](./aiken-workspace/validators/oneshot.ak).

### `gift_card`: one-shot minting policy

```aiken
validator gift_card(token_name: ByteArray, utxo_ref: OutputReference) {
  mint(rdmr: Action, policy_id: PolicyId, tx: Transaction) {
    let Transaction { inputs, mint, .. } = tx
    expect [Pair(asset_name, amount)] =
      mint
        |> assets.tokens(policy_id)
        |> dict.to_pairs()
    when rdmr is {
      Mint -> {
        expect Some(_input) =
          list.find(inputs, fn(input) { input.output_reference == utxo_ref })
        amount == 1 && asset_name == token_name
      }
      Burn -> amount == -1 && asset_name == token_name
    }
  }

  else(_) {
    fail
  }
}
```

- **Mint** succeeds only if the transaction spends `utxo_ref` and mints exactly one token named `token_name`. A UTxO can be spent only once, so the policy can mint only once: a true one-of-one token.
- **Burn** succeeds if exactly one token named `token_name` is burned.

### `redeem`: spending validator

```aiken
validator redeem(token_name: ByteArray, policy_id: ByteArray) {
  spend(_d: Option<Data>, _r: Data, _input: OutputReference, tx: Transaction) {
    let Transaction { mint, .. } = tx
    expect [Pair(asset_name, amount)] =
      mint
        |> assets.tokens(policy_id)
        |> dict.to_pairs()
    amount == -1 && asset_name == token_name
  }

  else(_) {
    fail
  }
}
```

The locked assets can be spent only in a transaction that burns the gift card token.

### Test and build

The file includes six tests covering successful mints and redeems, minting more than one token, wrong token names, and wrong burn amounts. With the [Aiken CLI](https://aiken-lang.org/installation-instructions) installed:

```bash
cd aiken-workspace
aiken check   # run tests
aiken build   # compile to plutus.json (CIP-57 blueprint)
```

A compiled `plutus.json` is already committed, so you only need Aiken if you change the contract. See the [validator specification](./aiken-workspace/readme.md) for details.

## Off-chain code

Both validators take parameters, so [`src/common.ts`](./src/common.ts) applies them to the compiled code with `applyParamsToScript` before use.

### Create a gift card

[`src/create.ts`](./src/create.ts) creates a gift card named `MeshGiftCard` holding 10 ADA:

1. Picks the wallet's first UTxO and uses it as the one-shot `utxo_ref` parameter.
2. Applies the token name and that UTxO reference to the minting policy, and derives the policy ID.
3. Spends that UTxO, mints one token with the `Mint` redeemer, and sends the 10 ADA plus the token to the script address.
4. Stores `[txHash, outputIndex, tokenNameHex]` as an inline datum, so the redeem step can rebuild the parameterized scripts later.

```ts
await txBuilder
  .txIn(firstUtxo.input.txHash, firstUtxo.input.outputIndex, firstUtxo.output.amount, firstUtxo.output.address)
  .mintPlutusScript("V3")
  .mint("1", giftCardPolicy, tokenNameHex)
  .mintingScript(scriptCbor)
  .mintRedeemerValue(mConStr0([]))
  .txOut(address, [...assets, { unit: giftCardPolicy + tokenNameHex, quantity: "1" }])
  .txOutInlineDatumValue([firstUtxo.input.txHash, firstUtxo.input.outputIndex, tokenNameHex])
  .changeAddress(walletAddress)
  .txInCollateral(collateral.input.txHash, collateral.input.outputIndex, collateral.output.amount, collateral.output.address)
  .selectUtxosFrom(remainingUtxos)
  .complete();
```

### Redeem a gift card

[`src/redeem.ts`](./src/redeem.ts) asks for the create transaction hash, then:

1. Reads the inline datum to recover the UTxO reference and token name.
2. Rebuilds the minting policy and the redeem script from those parameters.
3. Spends the gift card UTxO and burns the token with the `Burn` redeemer (`mConStr1([])`), sending the locked assets back to the wallet as change.

```ts
await txBuilder
  .spendingPlutusScript("V3")
  .txIn(giftCardUtxo.input.txHash, giftCardUtxo.input.outputIndex, giftCardUtxo.output.amount, giftCardUtxo.output.address)
  .spendingReferenceTxInInlineDatumPresent()
  .spendingReferenceTxInRedeemerValue("")
  .txInScript(redeemScript)
  .mintPlutusScript("V3")
  .mint("-1", giftCardPolicy, tokenNameHex)
  .mintingScript(scriptCbor)
  .mintRedeemerValue(mConStr1([]))
  .changeAddress(walletAddress)
  .txInCollateral(collateral.input.txHash, collateral.input.outputIndex, collateral.output.amount, collateral.output.address)
  .selectUtxosFrom(utxos)
  .complete();
```

## Run it

1. Install dependencies:

   ```bash
   cd aiken-giftcard
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in:

   ```bash
   BLOCKFROST_API_KEY=preprodxxxxxxxx
   MNEMONIC="word1,word2,...,word24"
   ```

   Use a [Blockfrost](https://blockfrost.io/) **preprod** project ID and a comma-separated testnet mnemonic.

3. Fund the wallet with test ADA from the [faucet](https://docs.cardano.org/cardano-testnets/tools/faucet). The scripts require a pure-ADA UTxO of at least 5 ADA to use as collateral, plus enough ADA in other UTxOs for the 10 ADA gift card and fees.

4. Create, then redeem:

   ```bash
   npm run create   # prints the create transaction hash
   npm run redeem   # paste the hash when prompted
   ```

## Learn more

- [Gift card contract demo](https://meshjs.dev/smart-contracts/giftcard)
- [Aiken with Mesh guide](https://meshjs.dev/aiken)
- [Smart contract transactions with MeshTxBuilder](https://meshjs.dev/apis/txbuilder/smart-contracts)
- [Aiken documentation](https://aiken-lang.org/)
