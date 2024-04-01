<script lang="ts">
	import LocationDeleteDialog from "./location-delete-dialog.svelte";
	import LocationEditDialog from "./location-edit-dialog.svelte";

	export let locationName: string;
</script>

{#key locationName}
	<div class="flex">
		<LocationDeleteDialog {locationName} />
		<LocationEditDialog {locationName} />
	</div>
{/key}
