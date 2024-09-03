import { Asset, deserializeAddress, mConStr0 } from "@meshsdk/core";
import { getScript, getTxBuilder, getWalletInfoForTx, wallet } from "./common";

export async function lockAsset(assets: Asset[]): Promise<string> {
  const { utxos, walletAddress } = await getWalletInfoForTx();
  const { scriptAddr } = getScript();
  const signerHash = deserializeAddress(walletAddress).pubKeyHash;

  const txBuilder = getTxBuilder();
  await txBuilder
    .txOut(scriptAddr, assets)
    .txOutDatumHashValue(mConStr0([signerHash]))
    .changeAddress(walletAddress)
    .selectUtxosFrom(utxos)
    .complete();
  return txBuilder.txHex;
}

async function main() {
  const assets: Asset[] = [
    {
      unit: "lovelace",
      quantity: "10000000",
    },
  ];

  const unsignedTx = await lockAsset(assets);

  const signedTx = await wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);
  console.log("txHash", txHash);
}

main();
