import { Asset, deserializeAddress, mConStr0 } from "@meshsdk/core";
import { getScript, getTxBuilder, getWalletInfoForTx, wallet } from "./common";
import blueprint from "../aiken-workspace/plutus.json";

export async function create(
  tokenName: string,
  assets: Asset[]
): Promise<string> {
  const { utxos, walletAddress } = await getWalletInfoForTx();
  const { scriptAddr } = getScript(blueprint.validators[0].compiledCode);
  return "";
}

async function main() {
  const tokenName = "MeshGiftCard";
  const assets: Asset[] = [
    {
      unit: "lovelace",
      quantity: "10000000",
    },
  ];

  const unsignedTx = await create(tokenName, assets);

  const signedTx = await wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);
  console.log("txHash", txHash);
}

main();
