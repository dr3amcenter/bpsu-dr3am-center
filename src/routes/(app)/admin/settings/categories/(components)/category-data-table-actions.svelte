<script lang="ts">
	import CategoryDeleteDialog from "./category-delete-dialog.svelte";
	import CategoryEditDialog from "./category-edit-dialog.svelte";

	export let categoryName: string;
</script>

{#key categoryName}
	<div class="flex">
		<CategoryDeleteDialog {categoryName} />
		<CategoryEditDialog {categoryName} />
	</div>
{/key}
