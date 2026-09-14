# Aiken Vesting: Time-Locked Cardano Smart Contract with Mesh

A vesting smart contract for Cardano that locks funds until a deadline. The on-chain validator is written in [Aiken](https://aiken-lang.org/) (Plutus V3), and the off-chain code uses the [Mesh SDK](https://meshjs.dev/) to deposit and withdraw on the preprod testnet.

A vesting contract holds funds for a **beneficiary** who can claim them only after a lockup period, while the **owner** who deposited them can withdraw at any time. A common use is employee compensation: an organization deposits tokens that an employee can claim once they have stayed long enough, which rewards retention.

## On-chain code

### Datum

The datum is set at deposit time and acts as the configuration for each vesting position. It is defined in [`aiken-workspace/validators/vesting.ak`](./aiken-workspace/validators/vesting.ak):

```aiken
pub type VestingDatum {
  /// POSIX time in milliseconds, e.g. 1672843961000
  lock_until: Int,
  /// Owner's credentials
  owner: ByteArray,
  /// Beneficiary's credentials
  beneficiary: ByteArray,
}
```

- `lock_until`: the POSIX timestamp in milliseconds when the lock ends.
- `owner`: the public key hash of the wallet that deposited the funds.
- `beneficiary`: the public key hash of the wallet that can claim after the deadline.

### Validator

```aiken
use cardano/transaction.{OutputReference, Transaction}
use vodka_extra_signatories.{key_signed}
use vodka_validity_range.{valid_after}

validator vesting {
  spend(
    datum_opt: Option<VestingDatum>,
    _redeemer: Data,
    _input: OutputReference,
    tx: Transaction,
  ) {
    expect Some(datum) = datum_opt
    or {
      key_signed(tx.extra_signatories, datum.owner),
      and {
        key_signed(tx.extra_signatories, datum.beneficiary),
        valid_after(tx.validity_range, datum.lock_until),
      },
    }
  }

  else(_) {
    fail
  }
}
```

The funds can be spent when either:

- the transaction is signed by the **owner**, or
- the transaction is signed by the **beneficiary** and is valid only after `lock_until`.

### How time works on-chain

Plutus scripts cannot read the current time. Instead, every transaction can declare a **validity interval**, and the ledger rejects the transaction before running any script if the current time is outside it. If a transaction's lower bound is after `lock_until`, the script knows the deadline has passed. That is what `valid_after` checks.

The upper bound is left open, so the beneficiary can claim at any point after the deadline, even years later.

### Test and build

The validator includes five tests covering owner unlocks, beneficiary unlocks after the deadline, and the failure cases. With the [Aiken CLI](https://aiken-lang.org/installation-instructions) installed:

```bash
cd aiken-workspace
aiken check   # run tests
aiken build   # compile to plutus.json (CIP-57 blueprint)
```

A compiled `plutus.json` is already committed, so you only need Aiken if you change the contract. See the [validator specification](./aiken-workspace/README.md) for the full test list.

## Off-chain code

### Deposit funds

[`src/deposit-fund.ts`](./src/deposit-fund.ts) locks 10 ADA for one minute, naming a beneficiary:

```ts
const assets: Asset[] = [{ unit: "lovelace", quantity: "10000000" }];

const lockUntilTimeStamp = new Date();
lockUntilTimeStamp.setMinutes(lockUntilTimeStamp.getMinutes() + 1);

const beneficiary =
  "addr_test1qpvx0sacufuypa2k4sngk7q40zc5c4npl337uusdh64kv0uafhxhu32dys6pvn6wlw8dav6cmp4pmtv7cc3yel9uu0nq93swx9";

const unsignedTx = await depositFundTx(assets, lockUntilTimeStamp.getTime(), beneficiary);
```

`depositFundTx` resolves the script address and both public key hashes, then sends the funds to the script with an inline datum:

```ts
export async function depositFundTx(amount: Asset[], lockUntilTimeStampMs: number, beneficiary: string) {
  const { utxos, walletAddress } = await getWalletInfoForTx();
  const { scriptAddr } = getScript(blueprint.validators[0].compiledCode);

  const { pubKeyHash: ownerPubKeyHash } = deserializeAddress(walletAddress);
  const { pubKeyHash: beneficiaryPubKeyHash } = deserializeAddress(beneficiary);

  const txBuilder = getTxBuilder();
  await txBuilder
    .txOut(scriptAddr, amount)
    .txOutInlineDatumValue(
      mConStr0([lockUntilTimeStampMs, ownerPubKeyHash, beneficiaryPubKeyHash])
    )
    .changeAddress(walletAddress)
    .selectUtxosFrom(utxos)
    .complete();
  return txBuilder.txHex;
}
```

The script then signs with `wallet.signTx(unsignedTx)`, submits with `wallet.submitTx(signedTx)`, and prints the transaction hash.

### Withdraw funds

[`src/withdraw-fund.ts`](./src/withdraw-fund.ts) asks for the deposit transaction hash and spends the vesting UTxO. It reads `lock_until` from the datum and sets the transaction's lower validity bound (`invalidBefore`) to the slot after whichever is earlier: the deadline, or 15 seconds ago.

- If the deadline has passed, the lower bound lands after `lock_until`, so a beneficiary withdrawal passes the time check.
- If the deadline has not passed, the lower bound is 15 seconds in the past, so the transaction is still valid now but only the owner's signature can unlock it.

```ts
const datum = deserializeDatum<VestingDatum>(vestingUtxo.output.plutusData!);

const invalidBefore =
  unixTimeToEnclosingSlot(
    Math.min(datum.fields[0].int as number, Date.now() - 15000),
    SLOT_CONFIG_NETWORK.preprod
  ) + 1;

await txBuilder
  .spendingPlutusScript("V3")
  .txIn(vestingUtxo.input.txHash, vestingUtxo.input.outputIndex, vestingUtxo.output.amount, scriptAddr)
  .spendingReferenceTxInInlineDatumPresent()
  .spendingReferenceTxInRedeemerValue("")
  .txInScript(scriptCbor)
  .txOut(walletAddress, [])
  .txInCollateral(collateralInput.txHash, collateralInput.outputIndex, collateralOutput.amount, collateralOutput.address)
  .invalidBefore(invalidBefore)
  .requiredSignerHash(pubKeyHash)
  .changeAddress(walletAddress)
  .selectUtxosFrom(utxos)
  .complete();
```

`spendingReferenceTxInInlineDatumPresent()` tells the builder the datum is already inline on the UTxO, and `requiredSignerHash` adds the signer to `extra_signatories` so the validator can check it. Spending from a Plutus script also needs a collateral input.

## Run it

This example imports a shared helper from the repository's root `common/` folder, so clone the whole repo.

1. Install dependencies:

   ```bash
   cd aiken-vesting
   npm install
   ```

2. Copy `.env.example` to `.env` and fill in:

   ```bash
   BLOCKFROST_API_KEY=preprodxxxxxxxx
   MNEMONIC="word1,word2,...,word24"
   ```

   Use a [Blockfrost](https://blockfrost.io/) **preprod** project ID and a comma-separated testnet mnemonic.

3. Fund the wallet with test ADA from the [faucet](https://docs.cardano.org/cardano-testnets/tools/faucet). Withdrawing requires a pure-ADA UTxO of at least 5 ADA to use as collateral.

4. Optionally, change the `beneficiary` address in `src/deposit-fund.ts`.

5. Deposit, then withdraw:

   ```bash
   npm run deposit    # prints the deposit transaction hash
   npm run withdraw   # paste the hash when prompted
   ```

The withdraw script signs with the wallet from `.env`. Run it with the depositing wallet to withdraw as the owner at any time, or with the beneficiary's wallet once the one-minute lock has passed. The slot calculation uses preprod settings, so this script runs on preprod only.

## Learn more

- [Aiken with Mesh guide](https://meshjs.dev/aiken)
- [Vesting contract demo](https://meshjs.dev/smart-contracts/vesting)
- [Smart contract transactions with MeshTxBuilder](https://meshjs.dev/apis/txbuilder/smart-contracts)
- [Aiken documentation](https://aiken-lang.org/)
