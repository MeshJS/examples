import { MeshTxBuilder } from "@meshsdk/core";
import { getUtxo } from "../common/get-utxo";
import { getWallet } from "../common/get-wallet";
import { getScript } from "./get-script";
import { selectUtxoFromWallet } from "../common/select-utxo-from-wallet";

// txHash of the transaction from the deposit-assets.ts script
const txHash =
  "a388a18a25caafe19fc7e2aeb2379b7b9f8f3789bb5ee6de8cf24afe47700780";

const wallet = getWallet();

const walletAddress = await wallet.getChangeAddress();

const { scriptAddr, scriptHex, hash } = getScript(walletAddress);

// get utxo from the script with this txHash
const utxo = await getUtxo(scriptAddr, txHash);

// select the utxo from the wallet to pay for fees
const walletUtxo = await selectUtxoFromWallet();

if (utxo == undefined || walletUtxo == undefined) {
  console.log("missing required utxos");
} else {
  const mesh = new MeshTxBuilder({});
  mesh
    .changeAddress(walletAddress)
    .txIn(
      utxo.input.txHash,
      utxo.input.outputIndex,
      utxo.output.amount,
      walletAddress
    )
    .txIn(
      walletUtxo.input.txHash,
      walletUtxo.input.outputIndex,
      walletUtxo.output.amount,
      walletAddress
    )
    .requiredSignerHash(hash)
    .txInScript(scriptHex)
    .completeSync();

  const signedTx = await wallet.signTx(mesh.txHex, true);
  const _txHash = await wallet.submitTx(signedTx);
  console.log("txHash", _txHash);
}
