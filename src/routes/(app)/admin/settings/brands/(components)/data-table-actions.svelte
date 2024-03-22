<script lang="ts">
	import DeleteBrandDialog from "./delete-brand-dialog.svelte";
	import EditBrandDialog from "./edit-brand-dialog.svelte";

	export let brandName: string;
</script>

{#key brandName}
	<DeleteBrandDialog {brandName} />
	<EditBrandDialog {brandName} />
{/key}
