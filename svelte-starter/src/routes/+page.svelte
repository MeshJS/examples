<script lang="ts">
  import { CardanoWallet, BrowserWalletState } from "@meshsdk/svelte";

  export async function getAddress() {
    const { wallet, connected, name, connecting, connect, disconnect } =
      BrowserWalletState;

    if (wallet) {
      const address = await wallet.getChangeAddress();
      console.log(address);
    }
  }
</script>

<div class="mesh-bg-gray-900 mesh-w-full mesh-text-white mesh-text-center">
  <main
    class={`mesh-flex mesh-min-h-screen mesh-flex-col mesh-items-center mesh-justify-center mesh-p-24`}
  >
    <h1 class="mesh-text-6xl mesh-font-thin mesh-mb-20">
      <a href="https://meshjs.dev/" class="mesh-text-sky-600"> Mesh </a>{" "}
      SvelteKit
    </h1>

    <div class="mesh-mb-20">
      <CardanoWallet isDark={true} />

      {#if BrowserWalletState.connected==true}
        <button on:click={getAddress}>getAddress</button>
      {/if}
    </div>

    <div
      class="mesh-grid mesh-grid-cols-1 md:mesh-grid-cols-2 lg:mesh-grid-cols-3 mesh-content-center mesh-justify-around"
    >
      <a
        href="https://meshjs.dev/apis"
        class="mesh-bg-gray-800 mesh-rounded-xl mesh-border mesh-border-white hover:mesh-scale-105 mesh-transition mesh-max-w-96 mesh-p-5 mesh-m-5"
      >
        <h2 class="mesh-text-2xl mesh-font-bold mesh-mb-2">Documentation</h2>
        <p class="mesh-text-gray-400">
          Our documentation provide live demos and code samples; great
          educational tool for learning how Cardano works.
        </p>
      </a>

      <a
        href="https://meshjs.dev/guides"
        class="mesh-bg-gray-800 mesh-rounded-xl mesh-border mesh-border-white hover:mesh-scale-105 mesh-transition mesh-max-w-96 mesh-p-5 mesh-m-5"
      >
        <h2 class="mesh-text-2xl mesh-font-bold mesh-mb-2">Guides</h2>
        <p class="mesh-text-gray-400">
          Whether you are launching a new NFT project or ecommerce store, these
          guides will help you get started.
        </p>
      </a>

      <a
        href="https://meshjs.dev/svelte"
        class="mesh-bg-gray-800 mesh-rounded-xl mesh-border mesh-border-white hover:mesh-scale-105 mesh-transition mesh-max-w-96 mesh-p-5 mesh-m-5 md:mesh-mx-auto lg:mesh-mx-5 md:mesh-col-span-2 lg:mesh-col-span-1"
      >
        <h2 class="mesh-text-2xl mesh-font-bold mesh-mb-2">
          Svelte components
        </h2>
        <p class="mesh-text-gray-400">
          Useful Svelte UI components, seamlessly integrate them into your app,
          and bring the user interface to life.
        </p>
      </a>
    </div>
  </main>
  <footer
    class="mesh-p-8 mesh-border-t mesh-border-gray-300 mesh-flex mesh-justify-center"
  ></footer>
</div>
