import { mConStr0 } from "@meshsdk/common";
import { Asset, deserializeAddress } from "@meshsdk/core";
import { getScript, getTxBuilder, getWalletInfoForTx, wallet } from "./common";

export async function depositFundTx(
  amount: Asset[],
  lockUntilTimeStampMs: number,
  beneficiary: string
): Promise<string> {
  const { utxos, walletAddress } = await getWalletInfoForTx();

  const { scriptAddr } = getScript();

  const { pubKeyHash: ownerPubKeyHash } = deserializeAddress(walletAddress);
  const { pubKeyHash: beneficiaryPubKeyHash } = deserializeAddress(beneficiary);

  const txBuilder = getTxBuilder();
  await txBuilder
    .txOut(scriptAddr, amount)
    .txOutInlineDatumValue(
      mConStr0([lockUntilTimeStampMs, ownerPubKeyHash, beneficiaryPubKeyHash])
    )
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

  const lockUntilTimeStamp = new Date();
  lockUntilTimeStamp.setMinutes(lockUntilTimeStamp.getMinutes() + 1);

  const beneficiary =
    "addr_test1qpvx0sacufuypa2k4sngk7q40zc5c4npl337uusdh64kv0uafhxhu32dys6pvn6wlw8dav6cmp4pmtv7cc3yel9uu0nq93swx9";

  const unsignedTx = await depositFundTx(
    assets,
    lockUntilTimeStamp.getTime(),
    beneficiary
  );

  const signedTx = await wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);
  console.log("txHash", txHash);
}

main();
