# Aiken Hello World Example

In this example, we will create a simple smart contract. This contract's validator has two requirements: the presence of the owner's verification key hash in the datum and a valid message in the redeemer. Both of these requirements must be met to unlock the assets.

## On-chain code

This is the on-chain code for the smart contract, it looks simple but it has a few funamental concepts that are important to understand.

```rs
use aiken/hash.{Blake2b_224, Hash}
use aiken/list
use aiken/transaction.{ScriptContext}
use aiken/transaction/credential.{VerificationKey}
 
type Datum {
  owner: Hash<Blake2b_224, VerificationKey>,
}
 
type Redeemer {
  msg: ByteArray,
}
 
validator {
  fn hello_world(datum: Datum, redeemer: Redeemer, context: ScriptContext) -> Bool {
    let must_say_hello =
      redeemer.msg == "Hello, World!"
 
    let must_be_signed =
      list.has(context.transaction.extra_signatories, datum.owner)
 
    must_say_hello && must_be_signed
  }
}
```

This validator checks for the presence of a valid verification key hash in the datum and a valid message in the redeemer.

First we define the `Datum` and `Redeemer` types. The `Datum` type contains the owner's verification key hash, while the `Redeemer` type contains the message.

> explain why `msg` is better in `type Redeemer`. explain why `owner` is better in `type Datum`.

Next, we define the `hello_world` function, which takes the `Datum`, `Redeemer`, and `ScriptContext` as arguments. The function checks if the message in the redeemer is "Hello, World!" and if the owner's verification key hash is present in the list of extra signatories. The validator returns `true` if both conditions are met, allowing the transaction to succeed.

In Cardano, the eUTxO model, the datum is defined when funds are locked in the contract, effectively serving as a form of configuration. In this scenario, we'll specify the owner and require their signature to unlock the funds. Without the owner's signature, the transaction will fail and funds will remain locked.






lock: 58c89135faf17997186f50806e9c22b9bc3d60adc5ba2b7a0a25dd6e28831988

unlock: 19f71081651eacfccf5e484c871647ca0fc487fa0c7c5ece8e820fe757f06c4c