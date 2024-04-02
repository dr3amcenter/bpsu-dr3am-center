<script lang="ts">
	import exportFromJSON from "export-from-json";
	import Button from "$lib/components/ui/button/button.svelte";

	export let fileName = "data";
	export let data: any[] = [];

	const exportType = exportFromJSON.types.csv;

	function exportData() {
		exportFromJSON({ data, fileName, exportType });
	}
</script>

<Button on:click={exportData} class={$$props.class}>Export</Button>
