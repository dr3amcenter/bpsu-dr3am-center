<script lang="ts">
	import "../app.pcss";

	import { Toaster } from "$lib/components/ui/sonner";
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
	<title>Hataw Takbo Barangay</title>
</svelte:head>

<Toaster richColors />
<slot />

<style>
	:global(body) {
		font-family: "Alexandria", sans-serif;
	}
</style>
