# Hello World: Validator Specification

The Aiken workspace for the [aiken-hello-world](../) example. Compiles to a Plutus V3 spending validator with Aiken compiler v1.1.0 and stdlib v2.

## Validator: `hello_world`

A spending validator that releases locked funds to the owner when they say hello.

### Parameters

None.

### Datum

| Field | Type | Description |
| ----- | ---- | ----------- |
| `owner` | `VerificationKeyHash` | Public key hash of the owner allowed to unlock |

### Redeemer

| Field | Type | Description |
| ----- | ---- | ----------- |
| `msg` | `ByteArray` | Must equal `"Hello, World!"` |

### Unlock conditions

A spend succeeds only when **both** are true:

- The redeemer `msg` is `"Hello, World!"`.
- The transaction is signed by `owner` (the key hash appears in `extra_signatories`).

Any other script purpose fails.

## Build and test

```bash
aiken check   # run the tests in validators/hello-world.ak
aiken build   # write the CIP-57 blueprint to plutus.json
```

| Test | Expected |
| ---- | -------- |
| `test_hello_world` | Passes with the correct message and owner signature |
| `test_failed_hello_world_incorrect_redeemer` | Fails with the message `"GM World!"` |
| `test_failed_hello_world_without_signer` | Fails without the owner's signature |

Tests use [mocktail](https://github.com/sidan-lab/vodka) from the `sidan-lab/vodka` library to build mock transactions.
