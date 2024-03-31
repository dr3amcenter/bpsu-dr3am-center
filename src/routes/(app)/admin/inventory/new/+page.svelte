<script>
	import ItemCreateForm from "../(components)/item-create-form.svelte";

	export let data;
</script>

<main class="container space-y-4">
	<h2 class="text-xl font-semibold text-orange">New Item</h2>

	<div class="bg-white p-4">
		<ItemCreateForm theForm={data.createItemForm} {...data} />
	</div>
</main>
