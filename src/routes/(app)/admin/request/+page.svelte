<script lang="ts">
	import Title from "$lib/components/title.svelte";
	import RequestsDataTable from "$lib/components/requests/request-data-table.svelte";

	export let data;
</script>

<Title title="Outgoing Request" />

<main class="container">
	<div class="bg-white p-6">
		<RequestsDataTable data={data.transactions} />
	</div>
</main>
