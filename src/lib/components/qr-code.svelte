<script lang="ts">
	import html2canvas from "html2canvas";

	import Dr3amLogo from "$lib/assets/img/dr3am-logo.png";
	import Qr from "./qr.svelte";

	export let value: string = "";
	export let title: string = "";

	let qrRef: HTMLElement;

	function download() {
		html2canvas(qrRef).then((c) => {
			const link = document.createElement("a");
			link.download = `${title}.png`;
			link.href = c.toDataURL();
			link.click();
		});
	}
</script>

<div class="flex">
	<div
		bind:this={qrRef}
		class="relative rounded-md border p-1.5 hover:cursor-pointer"
		on:click={download}
	>
		<Qr {value} />
		<img
			src="/favicon.png"
			alt="BPSU Dr3am Center Logo"
			class="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 transform bg-white opacity-70"
		/>
	</div>
</div>
