<script lang="ts">
	import QRCode, { type QRCodeRenderersOptions } from "qrcode";
	import html2canvas from "html2canvas";

	import { onMount } from "svelte";

	import Dr3amLogo from "$lib/assets/img/dr3am-logo.png";

	import { page } from "$app/stores";

	export let value: string = "";
	export let title: string = "";
	export let options: QRCodeRenderersOptions = { width: 100, margin: 1 };

	let canvas: HTMLCanvasElement;
	let qrRef: HTMLElement;

	function download() {
		html2canvas(qrRef).then((c) => {
			const link = document.createElement("a");
			link.download = `${title}.png`;
			link.href = c.toDataURL();
			link.click();
		});
	}

	onMount(async () => {
		if (canvas) {
			await QRCode.toCanvas(canvas, value, options);
		}
	});
</script>

<div class="flex flex-col items-start">
	<a
		href=""
		data-sveltekit-noscroll
		bind:this={qrRef}
		class="relative inline-flex rounded-md border p-1.5 hover:cursor-pointer"
		on:click={download}
	>
		<canvas bind:this={canvas} />
		<img
			src={Dr3amLogo}
			alt="BPSU Dr3am Center Logo"
			class="absolute left-1/2 top-1/2 w-8 -translate-x-1/2 -translate-y-1/2 transform bg-white opacity-70"
		/>
	</a>
	<span class="text-xs">Click to download</span>
</div>
