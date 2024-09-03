import {
  deserializeAddress,
  mConStr0,
  mConStr1,
  UTxO,
  stringToHex,
} from "@meshsdk/core";
import {
  getScript,
  getTxBuilder,
  getUtxoByTxHash,
  getWalletInfoForTx,
  wallet,
} from "./common";

export async function unlockAsset(
  scriptUtxo: UTxO,
  message: string
): Promise<string> {
  const { utxos, walletAddress, collateral } = await getWalletInfoForTx();
  const { scriptCbor } = getScript();
  const signerHash = deserializeAddress(walletAddress).pubKeyHash;

  const txBuilder = getTxBuilder();
  await txBuilder
    .spendingPlutusScriptV2()
    .txIn(
      scriptUtxo.input.txHash,
      scriptUtxo.input.outputIndex,
      scriptUtxo.output.amount,
      scriptUtxo.output.address
    )
    .txInScript(scriptCbor)
    .txInRedeemerValue(mConStr0([stringToHex(message)]))
    .txInDatumValue(mConStr0([signerHash]))
    .requiredSignerHash(signerHash)
    .changeAddress(walletAddress)
    .txInCollateral(
      collateral.input.txHash,
      collateral.input.outputIndex,
      collateral.output.amount,
      collateral.output.address
    )
    .selectUtxosFrom(utxos)
    .complete();
  return txBuilder.txHex;
}

async function main() {
  const txHashFromDesposit =
    "200b520bf41362de7a921be67be9d29c7b384325f9bfee6f5be252098972e2ab";
  const message = "Hello, World!";

  const utxo = await getUtxoByTxHash(txHashFromDesposit);

  if (utxo === undefined) throw new Error("UTxO not found");

  const unsignedTx = await unlockAsset(utxo, message);

  const signedTx = await wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);
  console.log("txHash", txHash);
}

main();
