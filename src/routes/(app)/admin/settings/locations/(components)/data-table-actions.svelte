<script lang="ts">
	import DeleteLocationDialog from "./delete-location-dialog.svelte";
	import EditLocationDialog from "./edit-location-dialog.svelte";

	export let locationName: string;
</script>

{#key locationName}
	<DeleteLocationDialog {locationName} />
	<EditLocationDialog {locationName} />
{/key}
