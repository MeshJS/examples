<script lang="ts">
	import '../app.css';
	import '@meshsdk/svelte/styles.css';
	let { children } = $props();

</script>

{@render children()}
