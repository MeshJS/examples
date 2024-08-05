import { getWalletForYaci } from "./common/get-wallet-yaci";

const wallet = getWalletForYaci();

const walletAddress = await wallet.getChangeAddress();
console.log("walletAddress", walletAddress);

const assets = await wallet.getBalance();
console.log("assets", assets);
