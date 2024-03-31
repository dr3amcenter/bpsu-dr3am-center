<script lang="ts">
	import Title from "$lib/components/title.svelte";
	import RequestsDataTable from "$lib/components/requests/request-data-table.svelte";

	export let data;
</script>

<Title title="Outgoing Request" />

<main class="container">
	<RequestsDataTable data={data.transactions} />
</main>
