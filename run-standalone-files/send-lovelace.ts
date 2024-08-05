import { Transaction } from "@meshsdk/core";
import { getWallet } from "./common/get-wallet";

// Initialize the wallet with a mnemonic key
const wallet = getWallet();
console.log(wallet.getChangeAddress())
const utxo = await wallet.getUtxos();
console.log(utxo);

// Create and send a transaction
const tx = new Transaction({ initiator: wallet });
tx.sendLovelace(
  "addr_test1qp2k7wnshzngpqw0xmy33hvexw4aeg60yr79x3yeeqt3s2uvldqg2n2p8y4kyjm8sqfyg0tpq9042atz0fr8c3grjmysdp6yv3",
  "1000000"
);

const unsignedTx = await tx.build();
const signedTx = await wallet.signTx(unsignedTx);
const txHash = await wallet.submitTx(signedTx);
console.log(txHash);
