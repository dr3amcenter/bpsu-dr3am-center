<script lang="ts">
	import CreateAccountDialog from "../(components)/create-account-dialog.svelte";
	import DataTable from "../(components)/data-table.svelte";
	import { Input } from "$lib/components/ui/input";

	export let data;

	let searchInput = "";
</script>

<main class="container">
	<div class="space-y-6 bg-white p-6">
		<div class="flex items-center gap-x-3">
			<Input
				class="max-w-xs rounded-sm border-0 bg-gray-100 px-4 py-6 text-gray-500"
				placeholder="Search"
				type="text"
				bind:value={searchInput}
			/>
			<div class="ml-auto">
				<CreateAccountDialog role="admin" />
			</div>
		</div>
		<DataTable data={data.admins} bind:searchInput />
	</div>
</main>
