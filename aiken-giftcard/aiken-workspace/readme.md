# Gift Card: Validator Specification

The Aiken workspace for the [aiken-giftcard](../) example. Compiles two Plutus V3 validators with Aiken compiler v1.1.0, stdlib v2 and [vodka](https://github.com/sidan-lab/vodka).

## Validator: `gift_card` (minting policy)

A one-shot minting policy for the gift card token.

### Parameters

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `token_name` | `ByteArray` | Name of the gift card token |
| `utxo_ref` | `OutputReference` | A UTxO that must be spent when minting, which makes the policy one-shot |

### Redeemer

```aiken
pub type Action {
  Mint
  Burn
}
```

### Conditions

The transaction must mint or burn exactly one asset name under this policy, and:

- **Mint:** `utxo_ref` is one of the transaction inputs, the amount is `1`, and the name is `token_name`.
- **Burn:** the amount is `-1` and the name is `token_name`.

Any other script purpose fails.

## Validator: `redeem` (spending validator)

Holds the assets locked in a gift card.

### Parameters

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| `token_name` | `ByteArray` | Name of the gift card token |
| `policy_id` | `ByteArray` | Policy ID of the `gift_card` minting policy |

### Datum and redeemer

Neither is checked. The off-chain code stores `[txHash, outputIndex, tokenNameHex]` as an inline datum so the scripts can be rebuilt at redeem time.

### Conditions

The transaction must burn exactly one asset under `policy_id`: amount `-1`, named `token_name`.

## Build and test

```bash
aiken check   # run the tests in validators/oneshot.ak
aiken build   # write the CIP-57 blueprint to plutus.json
```

| Test | Expected |
| ---- | -------- |
| `success_mint` | Passes when minting one correctly named token |
| `fail_mint_with_more_than_1_mint` | Fails when minting two tokens |
| `fail_mint_without_param_name_minted` | Fails when the token name does not match |
| `success_redeem` | Passes when burning one correctly named token |
| `fail_redeem_without_correct_name` | Fails when the burned token name does not match |
| `fail_redeem_without_correct_mint_info` | Fails when burning two tokens |

## Blueprint

`plutus.json` lists the validators in this order. The off-chain code refers to them by index.

| Index | Title |
| ----- | ----- |
| 0 | `oneshot.gift_card.mint` |
| 1 | `oneshot.gift_card.else` |
| 2 | `oneshot.redeem.spend` |
| 3 | `oneshot.redeem.else` |
