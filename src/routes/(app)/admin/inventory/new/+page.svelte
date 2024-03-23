<script>
	import NewEquipmentForm from "$lib/components/new-equipment-form.svelte";

	export let data;
</script>

<main class="container space-y-4">
	<h2 class="text-xl font-semibold text-orange">New Equipment</h2>

	<div class="bg-white p-4">
		<NewEquipmentForm theForm={data.form} {...data} />
	</div>
</main>
