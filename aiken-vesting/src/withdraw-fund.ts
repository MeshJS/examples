import {
  deserializeAddress,
  deserializeDatum,
  UTxO,
  unixTimeToEnclosingSlot,
  SLOT_CONFIG_NETWORK,
  ConStr0,
  Integer,
  BuiltinByteString,
} from "@meshsdk/core";
import {
  getScript,
  getTxBuilder,
  getUtxoByTxHash,
  getWalletInfoForTx,
  wallet,
} from "./common";
import blueprint from "../aiken-workspace/plutus.json";
import { prompt } from "../../common/prompt";

export type VestingDatum = ConStr0<
  [Integer, BuiltinByteString, BuiltinByteString]
>;

export async function withdrawFundTx(vestingUtxo: UTxO): Promise<string> {
  const { utxos, walletAddress, collateral } = await getWalletInfoForTx();
  const { input: collateralInput, output: collateralOutput } = collateral;

  const { scriptAddr, scriptCbor } = getScript(
    blueprint.validators[0].compiledCode
  );

  const { pubKeyHash } = deserializeAddress(walletAddress);

  const datum = deserializeDatum<VestingDatum>(vestingUtxo.output.plutusData!);

  const invalidBefore =
    unixTimeToEnclosingSlot(
      Math.min(datum.fields[0].int as number, Date.now() - 15000),
      SLOT_CONFIG_NETWORK.preprod
    ) + 1;

  const txBuilder = getTxBuilder();
  await txBuilder
    .spendingPlutusScript("V3")
    .txIn(
      vestingUtxo.input.txHash,
      vestingUtxo.input.outputIndex,
      vestingUtxo.output.amount,
      scriptAddr
    )
    .spendingReferenceTxInInlineDatumPresent()
    .spendingReferenceTxInRedeemerValue("")
    .txInScript(scriptCbor)
    .txOut(walletAddress, [])
    .txInCollateral(
      collateralInput.txHash,
      collateralInput.outputIndex,
      collateralOutput.amount,
      collateralOutput.address
    )
    .invalidBefore(invalidBefore)
    .requiredSignerHash(pubKeyHash)
    .changeAddress(walletAddress)
    .selectUtxosFrom(utxos)
    .complete();
  return txBuilder.txHex;
}

async function main() {
  const txHashFromDesposit = await prompt("Transaction hash from deposit: ");

  const utxo = await getUtxoByTxHash(txHashFromDesposit);

  if (utxo === undefined) throw new Error("UTxO not found");

  const unsignedTx = await withdrawFundTx(utxo);

  const signedTx = await wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);
  console.log("txHash", txHash);
}

main();
