<script lang="ts">
	import "../app.pcss";

	import { Toaster } from "$lib/components/ui/sonner";

	import { navigating } from "$app/stores";
</script>

<svelte:head>
	<style>
		@font-face {
			font-family: "Alexandria";
			font-style: normal;
			font-weight: 500;
			src: url("/Alexandria-VariableFont_wght.ttf"); /* IE9 Compat Modes */
		}
	</style>
	<title>SeQuR IEnventory System</title>
</svelte:head>

{#if $navigating}
	<div class="fixed inset-0 z-[999] flex items-center justify-center bg-black/80">
		<img src="/favicon.png" class="w-24 animate-pulse" alt="SeQuR IEnventory System Logo" />
	</div>
{/if}

<Toaster richColors />
<slot />

<style>
	:global(body) {
		font-family: "Alexandria", sans-serif;
	}
</style>
