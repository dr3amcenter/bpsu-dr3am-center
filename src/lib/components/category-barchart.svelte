<script lang="ts">
	import { onMount } from "svelte";
	import Chart from "chart.js/auto";

	let canvas: HTMLCanvasElement;

	export let outerWidth: number;

	export let data: {
		category: string;
	}[];

	$: groupedData = data.reduce(
		(result, current) => {
			const existingItem = result.find((item) => item.label === current.category);

			if (existingItem) {
				existingItem.count++;
			} else {
				result.push({ label: current.category, count: 1 });
			}

			return result;
		},
		[] as { label: string; count: number }[]
	);

	onMount(() => {
		new Chart(canvas, {
			type: "bar",
			data: {
				labels: groupedData.map((row) => row.label),
				datasets: [
					{
						label: "Availability",
						data: groupedData.map((row) => row.count)
					}
				]
			},
			options: {
				indexAxis: outerWidth >= 800 ? "x" : "y"
			}
		});
	});
</script>

<canvas bind:this={canvas} />
