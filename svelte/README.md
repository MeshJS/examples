# Starter svelte TypeScript

Start a new project with svelte.


The key changes to support wasm are in `vite.config.ts`:

```
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
	plugins: [
		sveltekit(),
		wasm(),
		topLevelAwait(),
		nodePolyfills({
			globals: { Buffer: true, global: true },
			protocolImports: true
		})
	],
	define: {
		global: 'globalThis'
	}
});
```