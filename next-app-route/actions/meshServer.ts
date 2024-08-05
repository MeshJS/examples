"use server";

import { BlockfrostProvider } from "@meshsdk/core";
import { MeshWallet } from "@meshsdk/core";

export const someAction = async () => {
  const APIKEY = process.env.BLOCKFROST_API!;
  const SEEDPHRASENAMI = process.env.SEEDPHRASENAMI!;

  console.log(APIKEY);
  console.log(SEEDPHRASENAMI);

  const blockchainProvider = new BlockfrostProvider(APIKEY);
  console.log(blockchainProvider);

  const wallet = new MeshWallet({
    networkId: 0, // 0: testnet, 1: mainnet
    fetcher: blockchainProvider,
    submitter: blockchainProvider,
    key: {
      type: "mnemonic",
      words: [SEEDPHRASENAMI],
    },
  });

  console.log(wallet);

  const address = wallet.getChangeAddress();
  console.log(address);
};
