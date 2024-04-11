<script lang="ts">
	import QRCode, { type QRCodeRenderersOptions } from "qrcode";
	import { onMount } from "svelte";

	let canvas: HTMLCanvasElement;
	export let value: string = "";
	export let options: QRCodeRenderersOptions = { width: 100, margin: 1 };

	onMount(async () => {
		if (canvas) {
			await QRCode.toCanvas(canvas, value, options);
		}
	});
</script>

<canvas bind:this={canvas} />
