<script lang="ts">
	import DeleteClassificationDialog from "./delete-classification-dialog.svelte";
	import EditClassificationDialog from "./edit-classification-dialog.svelte";

	export let classificationName: string;
</script>

{#key classificationName}
	<DeleteClassificationDialog {classificationName} />
	<EditClassificationDialog {classificationName} />
{/key}
