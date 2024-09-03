import {
  BlockfrostProvider,
  BuiltinByteString,
  ConStr0,
  Integer,
  MeshTxBuilder,
  MeshWallet,
  serializePlutusScript,
  UTxO,
} from "@meshsdk/core";
import { blockfrost_api_key, wallet_mnemonic } from "./configs";
import { applyParamsToScript } from "@meshsdk/core-csl";
import blueprint from "../aiken-workspace/plutus.json";

export type VestingDatum = ConStr0<
  [Integer, BuiltinByteString, BuiltinByteString]
>;

const blockchainProvider = new BlockfrostProvider(blockfrost_api_key);

export const wallet = new MeshWallet({
  networkId: 0,
  fetcher: blockchainProvider,
  submitter: blockchainProvider,
  key: {
    type: "mnemonic",
    words: wallet_mnemonic,
  },
});

export async function getWalletInfoForTx() {
  const utxos = await wallet.getUtxos();
  const collateral = (await wallet.getCollateral())[0];
  const walletAddress = await wallet.getChangeAddress();

  if (!utxos || utxos?.length === 0) {
    throw new Error("No utxos found");
  }
  if (!collateral) {
    throw new Error("No collateral found");
  }
  if (!walletAddress) {
    throw new Error("No wallet address found");
  }
  return { utxos, collateral, walletAddress };
}

export function getScript() {
  const scriptCbor = applyParamsToScript(
    blueprint.validators[0].compiledCode,
    []
  );

  const scriptAddr = serializePlutusScript(
    { code: scriptCbor, version: "V2" },
    undefined,
    0
  ).address;

  return { scriptCbor, scriptAddr };
}

export function getTxBuilder() {
  const txBuilder = new MeshTxBuilder({
    fetcher: blockchainProvider,
    submitter: blockchainProvider,
  });
  return txBuilder;
}

export async function getUtxoByTxHash(
  txHash: string
): Promise<UTxO | undefined> {
  const utxos = await blockchainProvider.fetchUTxOs(txHash);
  let scriptUtxo = utxos[0];

  return scriptUtxo;
}
