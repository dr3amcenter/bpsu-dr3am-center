<script lang="ts">
	import ItemEditForm from "$lib/components/item/item-edit-form.svelte";

	export let data;
</script>

<main class="container space-y-4">
	<h2 class="text-xl font-semibold text-orange">Edit Item</h2>
	<ItemEditForm {...data} />
</main>
