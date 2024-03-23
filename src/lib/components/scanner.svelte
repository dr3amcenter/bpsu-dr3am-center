<script lang="ts">
	import QrScanner from "qr-scanner";
	import { onMount } from "svelte";

	let scannedResult: string;
	let videoFeed: HTMLVideoElement;

	onMount(() => {
		const scanner = new QrScanner(
			videoFeed,
			async (result: { data: string }) => {
				scannedResult = result.data;
			},
			{
				/* your options or returnDetailedScanResult: true if you're not specifying any other options */
				highlightScanRegion: true
				// overlay: scannerOverlay
			}
		);

		scanner.start();

		return () => {
			scanner.destroy();
		};
	});

	$: {
		if (scannedResult) {
			console.log(scannedResult);
		}
	}
</script>

<div class="flex h-screen w-full flex-col p-0">
	<!-- svelte-ignore a11y-media-has-caption -->
	<video bind:this={videoFeed} class="flex-1" />
</div>
