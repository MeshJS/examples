import { BlockfrostProvider, MeshWallet, Transaction } from "@meshsdk/core";

// Set up the blockchain provider with your key
const blockchainProvider = new BlockfrostProvider("YOUR_KEY_HERE");

// Initialize the wallet with a mnemonic key
const wallet = new MeshWallet({
  networkId: 0,
  fetcher: blockchainProvider,
  submitter: blockchainProvider,
  key: {
    type: "mnemonic",
    words: ["your", "mnemonic", "...", "here"],
  },
});

// Create and send a transaction
const tx = new Transaction({ initiator: wallet }).sendLovelace(
  "addr_test1qp2k7wnshzngpqw0xmy33hvexw4aeg60yr79x3yeeqt3s2uvldqg2n2p8y4kyjm8sqfyg0tpq9042atz0fr8c3grjmysdp6yv3",
  "1000000"
);

const unsignedTx = await tx.build();
const signedTx = await wallet.signTx(unsignedTx);
const txHash = await wallet.submitTx(signedTx);
console.log(txHash);
