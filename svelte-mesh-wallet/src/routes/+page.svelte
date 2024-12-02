<script>
	import { MeshWallet } from '@meshsdk/core';
	import { BlockfrostProvider } from '@meshsdk/core';
	import { Transaction } from '@meshsdk/core';

	async function loadWalletBuildTx() {
		const blockchainProvider = new BlockfrostProvider('preprodxxx');

		const wallet = new MeshWallet({
			networkId: 0, // 0: testnet, 1: mainnet
			fetcher: blockchainProvider,
			submitter: blockchainProvider,
			key: {
				type: 'mnemonic',
				words: [
					'solution',
					'solution',
					'solution',
					'solution',
					'solution',
					'solution',
					'solution',
					'solution',
					'solution',
					'solution',
					'solution',
					'solution',
					'solution',
					'solution',
					'solution',
					'solution',
					'solution',
					'solution',
					'solution',
					'solution',
					'solution',
					'solution',
					'solution',
					'solution'
				]
			}
		});

		const changeAddress = await wallet.getChangeAddress();
		console.log({ changeAddress });

		// simple tx
		const tx = new Transaction({ initiator: wallet, verbose: true });
		tx.sendLovelace(changeAddress, '1000000');

		const unsignedTx = await tx.build();
		const signedTx = await wallet.signTx(unsignedTx);
		const txHash = await wallet.submitTx(signedTx);
		console.log({ txHash });
	}
</script>

<h1 class="text-lg">Welcome to SvelteKit + MeshJS</h1>
<button on:click={() => loadWalletBuildTx()}>Load Wallet Build Tx</button>
