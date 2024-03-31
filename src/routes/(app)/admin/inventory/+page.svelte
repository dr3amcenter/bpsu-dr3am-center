<script lang="ts">
	import ItemDataTable from "./(components)/item-data-table.svelte";

	export let data;
</script>

<main class="container">
	<ItemDataTable data={data.equipments} />
</main>
