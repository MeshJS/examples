<script setup>
import { BrowserWallet } from "@meshsdk/core";

const installedWallets = computed(() => BrowserWallet.getInstalledWallets());

const connectedWallet = ref(null);
const walletAPI = ref(null);
const walletDetails = reactive({
  address: null,
  assets: [],
  lovelace: null
});

const isWalletConnected = computed(() => !!connectedWallet.value);

const connectWallet = async (provider) => {
  walletAPI.value = await BrowserWallet.enable(provider);
  connectedWallet.value = installedWallets.value.filter(
    (w) => w.name === provider
  )[0];
  getWalletDetails();
};

const disconnectWallet = async () => {
  connectedWallet.value = null;
  walletAPI.value = null;
};

const getWalletDetails = async () => {
  await Promise.all([
    walletAPI.value.getAssets(),
    walletAPI.value.getChangeAddress(),
    walletAPI.value.getLovelace()
  ]).then(([assets, address, lovelace]) => {
    walletDetails.address = address;
    walletDetails.assets = assets || [];
    walletDetails.lovelace = lovelace;
  })
};
</script>

<template>
  <div>
    <h1>Mesh Vite Test</h1>

    <div v-if="isWalletConnected">
      <h2>Connected Wallet</h2>
      <button @click="disconnectWallet">Disconnect</button>
      <p>Wallet: {{ connectedWallet.name }}</p>
      <p>Address: {{ walletDetails.address }}</p>
      <p>Lovelace: {{ walletDetails.lovelace }}</p>
      <h3>Assets</h3>
      <ul>
        <li v-for="asset in walletDetails.assets" :key="asset.assetId">
          <p>{{ asset.quantity}}) {{ asset.fingerprint }}</p>
        </li>
      </ul>
    </div>
    <div v-else>
      <h2>Installed Wallets</h2>
      <ul>
        <li
          v-for="wallet in installedWallets"
          :key="wallet.name"
          style="margin: 1rem"
        >
          <button @click="connectWallet(wallet.name)">
            <img :src="wallet.icon" alt="wallet.name" width="100" />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
