import { keepRelevant, Unit, Quantity } from "@meshsdk/core";
import { getWallet } from "./get-wallet";

export async function selectUtxoFromWallet(assetMap?: Map<Unit, Quantity>) {
  const wallet = getWallet();
  const utxos = await wallet.getUtxos();

  if (assetMap === undefined) {
    assetMap = new Map<Unit, Quantity>();
    assetMap.set("lovelace", "2000000");
  }

  const selectedUtxos = keepRelevant(assetMap, utxos);
  return selectedUtxos[0];
}
