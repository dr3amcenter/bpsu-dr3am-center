<script lang="ts">
	import LocationDeleteDialog from "./location-delete-dialog.svelte";
	import LocationEditDialog from "./location-edit-dialog.svelte";

	export let locationName: string;
</script>

{#key locationName}
	<LocationDeleteDialog {locationName} />
	<LocationEditDialog {locationName} />
{/key}
