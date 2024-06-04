import { Transaction, UTxO } from "@meshsdk/core";
import { getWalletForYaci } from "./common/get-wallet-yaci";
import { getYaciProvider } from "./common/get-yaci-provider";

const wallet = getWalletForYaci();

const recipient =
  "addr_test1qqm87edtdxc7vu2u34dpf9jzzny4qhk3wqezv6ejpx3vgrwt46dz4zq7vqll88fkaxrm4nac0m5cq50jytzlu0hax5xqwlraql";

async function getRecipientAsset() {
  const blockchainProvider = getYaciProvider();
  const utxos = await blockchainProvider.fetchAddressUTxOs(recipient);
  return utxos;
}

async function makeTx() {
  const tx = new Transaction({ initiator: wallet }).sendLovelace(
    recipient,
    "25000000"
  );
  const unsignedTx = await tx.build();
  const signedTx = await wallet.signTx(unsignedTx);
  const txHash = await wallet.submitTx(signedTx);
  return txHash;
}

const utxoBefore = await getRecipientAsset();
console.log("num utxo before tx", utxoBefore.length);

const txHash = await makeTx();
console.log("txHash", txHash);

const utxoAfter = await new Promise<UTxO[]>(async (resolve) => {
  setTimeout(async () => {
    resolve(await getRecipientAsset());
  }, 1000);
});

console.log("num utxo after tx", utxoAfter.length);
