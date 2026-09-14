# Vesting: Validator Specification

The Aiken workspace for the [aiken-vesting](../) example. Compiles to a Plutus V3 spending validator with Aiken compiler v1.1.0, stdlib v2 and [vodka](https://github.com/sidan-lab/vodka).

## Validator: `vesting`

A spending validator that locks funds until a deadline, for a beneficiary.

### Parameters

None.

### Datum

| Field | Type | Description |
| ----- | ---- | ----------- |
| `lock_until` | `Int` | POSIX time in **milliseconds** when the lock ends, e.g. `1672843961000` |
| `owner` | `ByteArray` | Owner's public key hash |
| `beneficiary` | `ByteArray` | Beneficiary's public key hash |

### Redeemer

Any value. The validator ignores it.

### Unlock conditions

A spend succeeds when **either**:

1. **Owner unlock:** the transaction is signed by `owner`, at any time.
2. **Beneficiary unlock:** the transaction is signed by `beneficiary` **and** its validity range starts after `lock_until`.

A spend with no datum fails, and any other script purpose fails.

## Build and test

```bash
aiken check   # run the tests in validators/vesting.ak
aiken build   # write the CIP-57 blueprint to plutus.json
```

| Test | Expected |
| ---- | -------- |
| `success_unlocking` | Passes when signed by both parties after the deadline |
| `success_unlocking_with_only_owner_signature` | Passes when signed by the owner before the deadline |
| `success_unlocking_with_beneficiary_signature_and_time_passed` | Passes when signed by the beneficiary after the deadline |
| `fail_unlocking_with_only_beneficiary_signature` | Fails when signed by the beneficiary before the deadline |
| `fail_unlocking_with_only_time_passed` | Fails after the deadline with no valid signature |
