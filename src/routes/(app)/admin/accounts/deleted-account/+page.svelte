<script lang="ts">
	import DataTable from "../(components)/data-table.svelte";
	import { Input } from "$lib/components/ui/input";

	export let data;

	let searchInput = "";
</script>

<main class="container space-y-6">
	<div class="mb-6 space-y-6">
		<div
			class="ml-auto flex items-center gap-x-3 rounded-sm border border-primary bg-white p-6 shadow-sm"
		>
			<Input
				class="max-w-xs rounded-sm border-0 bg-gray-100 px-4 py-6 text-gray-500"
				placeholder="Search"
				type="text"
				bind:value={searchInput}
			/>
		</div>
	</div>

	<DataTable data={data.deletedAccounts} bind:searchInput />
</main>
