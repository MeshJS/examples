"use client";
import { BlockfrostProvider } from "@meshsdk/core";
import { MeshWallet } from "@meshsdk/core";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <button
        type="button"
        onClick={() => {
          const blockchainProvider = new BlockfrostProvider("API_KEY");
          const wallet = new MeshWallet({
            networkId: 0, // 0: testnet, 1: mainnet
            fetcher: blockchainProvider,
            submitter: blockchainProvider,
            key: {
              type: "mnemonic",
              words: "solution,".repeat(24).split(",").slice(0, 24),
            },
          });

          const address = wallet.getChangeAddress();
          alert(address);
          console.log(address);
        }}
      >
        Get Address
      </button>
    </div>
  );
}
