<script lang="ts">
	import ClassificationDelegeDialog from "./classification-delete-dialog.svelte";
	import ClassificationEditDialog from "./classification-edit-dialog.svelte";

	export let classificationName: string;
</script>

{#key classificationName}
	<ClassificationDelegeDialog {classificationName} />
	<ClassificationEditDialog {classificationName} />
{/key}
