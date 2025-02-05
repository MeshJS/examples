import { Asset, mConStr0, resolveScriptHash, stringToHex } from "@meshsdk/core";
import { getScript, getTxBuilder, getWalletInfoForTx, wallet } from "./common";
import blueprint from "../aiken-workspace/plutus.json";

const networkId = 0;

export async function create(
  tokenName: string,
  assets: Asset[]
): Promise<string> {
  const { utxos, walletAddress, collateral } = await getWalletInfoForTx();
  const tokenNameHex = stringToHex(tokenName);

  const firstUtxo = utxos[0];
  if (firstUtxo === undefined) throw new Error("No UTXOs available");
  const remainingUtxos = utxos.slice(1);
  const { scriptCbor, address } = getScript(
    blueprint.validators[0].compiledCode,
    tokenNameHex,
    firstUtxo.input.txHash,
    firstUtxo.input.outputIndex,
    networkId
  );

  const giftCardPolicy = resolveScriptHash(scriptCbor, "V3");

  const txBuilder = getTxBuilder();
  await txBuilder
    .txIn(
      firstUtxo.input.txHash,
      firstUtxo.input.outputIndex,
      firstUtxo.output.amount,
      firstUtxo.output.address
    )
    .mintPlutusScript("V3")
    .mint("1", giftCardPolicy, tokenNameHex)
    .mintingScript(scriptCbor)
    .mintRedeemerValue(mConStr0([]))
    .txOut(address, [
      ...assets,
      { unit: giftCardPolicy + tokenNameHex, quantity: "1" },
    ])
    .txOutInlineDatumValue([
      firstUtxo.input.txHash,
      firstUtxo.input.outputIndex,
      tokenNameHex,
    ])
    .changeAddress(walletAddress)
    .txInCollateral(
      collateral.input.txHash,
      collateral.input.outputIndex,
      collateral.output.amount,
      collateral.output.address
    )
    .selectUtxosFrom(remainingUtxos)
    .complete();

  return txBuilder.txHex;
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
