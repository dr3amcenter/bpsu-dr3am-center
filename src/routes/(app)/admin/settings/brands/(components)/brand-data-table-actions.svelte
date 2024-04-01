<script lang="ts">
	import BrandDeleteDialog from "./brand-delete-dialog.svelte";
	import BrandEditDialog from "./brand-edit-dialog.svelte";

	export let brandName: string;
</script>

{#key brandName}
	<div class="flex">
		<BrandDeleteDialog {brandName} />
		<BrandEditDialog {brandName} />
	</div>
{/key}
