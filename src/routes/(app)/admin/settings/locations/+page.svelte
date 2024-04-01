<script>
	import { Input } from "$lib/components/ui/input";
	import Title from "$lib/components/title.svelte";
	import LocationDataTable from "./(components)/location-data-table.svelte";

	import LocationCreateDialog from "./(components)/location-create-dialog.svelte";

	export let data;

	let searchInput = "";
</script>

<Title title="Locations" />

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
				<LocationCreateDialog theForm={data.createLocationsForm} />
			</div>
		</div>
		<LocationDataTable data={data.locations} bind:searchInput />
	</div>
</main>
