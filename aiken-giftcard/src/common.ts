import {
  BlockfrostProvider,
  builtinByteString,
  MeshTxBuilder,
  MeshWallet,
  outputReference,
  serializePlutusScript,
  UTxO,
} from "@meshsdk/core";
import { applyParamsToScript } from "@meshsdk/core-cst";
import dotenv from "dotenv";
dotenv.config();

export const blockfrost_api_key = process.env.BLOCKFROST_API_KEY || "";
export const wallet_mnemonic = process.env.MNEMONIC
  ? process.env.MNEMONIC.split(",")
  : "solution,".repeat(24).split(",").slice(0, 24);

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

export function getScript(
  blueprintCompiledCode: string,
  tokenNameHex: string,
  utxoTxHash: string,
  utxoTxId: number,
  networkId = 0
) {
  const utxo = outputReference(utxoTxHash, utxoTxId);

  const scriptCbor = applyParamsToScript(
    blueprintCompiledCode,
    [builtinByteString(tokenNameHex), utxo],
    "JSON"
  );
  const { address } = serializePlutusScript(
    { code: scriptCbor, version: "V3" },
    undefined,
    networkId
  );

  return { scriptCbor, address };
}

export function redeemCbor(
  blueprintCompiledCode: string,
  tokenNameHex: string,
  policyId: string
) {
  return applyParamsToScript(blueprintCompiledCode, [tokenNameHex, policyId]);
}

export function getTxBuilder() {
  return new MeshTxBuilder({
    fetcher: blockchainProvider,
    submitter: blockchainProvider,
  });
}

export async function getUtxoByTxHash(txHash: string): Promise<UTxO> {
  const utxos = await blockchainProvider.fetchUTxOs(txHash);
  if (utxos.length === 0) {
    throw new Error("UTxO not found");
  }
  return utxos[0];
}

import * as readline from "node:readline/promises";

export async function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const res = await rl.question(question);
  rl.close();
  return res;
}
