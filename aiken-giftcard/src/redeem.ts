import { BuiltinByteString, Integer, List, mConStr1 } from "@meshsdk/common";
import { deserializeDatum, resolveScriptHash, UTxO } from "@meshsdk/core";
import {
  getScript,
  getTxBuilder,
  getUtxoByTxHash,
  getWalletInfoForTx,
  redeemCbor,
  wallet,
  prompt,
} from "./common";
import blueprint from "../aiken-workspace/plutus.json";

const networkId = 0;

export async function redeemGiftCard(giftCardUtxo: UTxO): Promise<string> {
  const { utxos, walletAddress, collateral } = await getWalletInfoForTx();

  const inlineDatum = deserializeDatum<List>(
    giftCardUtxo.output.plutusData!
  ).list;
  const paramTxHash = (inlineDatum[0] as BuiltinByteString).bytes;
  const paramTxId = (inlineDatum[1] as Integer).int as number;
  const tokenNameHex = (inlineDatum[2] as BuiltinByteString).bytes;

  const { scriptCbor } = getScript(
    blueprint.validators[0].compiledCode,
    tokenNameHex,
    paramTxHash,
    paramTxId,
    networkId
  );

  const giftCardPolicy = resolveScriptHash(scriptCbor, "V3");

  const redeemScript = redeemCbor(
    blueprint.validators[0].compiledCode,
    tokenNameHex,
    giftCardPolicy
  );

  const txBuilder = getTxBuilder();
  await txBuilder
    .spendingPlutusScript("V3")
    .txIn(
      giftCardUtxo.input.txHash,
      giftCardUtxo.input.outputIndex,
      giftCardUtxo.output.amount,
      giftCardUtxo.output.address
    )
    .spendingReferenceTxInInlineDatumPresent()
    .spendingReferenceTxInRedeemerValue("")
    .txInScript(redeemScript)
    .mintPlutusScript("V3")
    .mint("-1", giftCardPolicy, tokenNameHex)
    .mintingScript(scriptCbor)
    .mintRedeemerValue(mConStr1([]))
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
  const txHashFromDesposit = await prompt(
    "Transaction hash from create giftcard: "
  );

  const utxo = await getUtxoByTxHash(txHashFromDesposit);

  const unsignedTx = await redeemGiftCard(utxo);

  const signedTx = await wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);
  console.log("txHash", txHash);
}

main();
