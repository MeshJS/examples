import { getProvider } from "./get-provider";

export async function getUtxo(address: string, txHash: string) {
  const blockchainProvider = getProvider();

  const utxos = await blockchainProvider.fetchAddressUTxOs(address);
  return utxos.filter((utxo) => utxo.input.txHash === txHash)[0];
}
