<script lang="ts">
	import DeleteCategoryDialog from "./delete-category-dialog.svelte";
	import EditCategoryDialog from "./edit-category-dialog.svelte";

	export let categoryName: string;
</script>

{#key categoryName}
	<DeleteCategoryDialog {categoryName} />
	<EditCategoryDialog {categoryName} />
{/key}
