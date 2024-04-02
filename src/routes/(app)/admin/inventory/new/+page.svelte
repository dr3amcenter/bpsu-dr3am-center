<script>
	import ItemCreateForm from "$lib/components/item/item-create-form.svelte";

	export let data;
</script>

<main class="container space-y-4">
	<h2 class="text-xl font-semibold text-orange">New Item</h2>

	<ItemCreateForm theForm={data.createItemForm} {...data} />
</main>
