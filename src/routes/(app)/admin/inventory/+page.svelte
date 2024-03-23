<script lang="ts">
	import DataTable from "./data-table.svelte";

	export let data;
</script>

<main class="container">
	<DataTable data={data.equipments} />
</main>
