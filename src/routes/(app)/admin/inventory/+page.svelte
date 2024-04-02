<script lang="ts">
	import ExportBtn from "$lib/components/export-btn.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import Input from "$lib/components/ui/input/input.svelte";
	import ItemDataTable from "$lib/components/item/item-data-table.svelte";
	import ItemFilter from "$lib/components/item/item-filter.svelte";

	export let data;

	let searchInput = "";

	$: filterSelect = {
		categories: data.categories.map((v) => v.categoryName),
		brands: data.brands.map((v) => v.brandName),
		locations: data.locations.map((v) => v.locationName),
		classifications: data.classifications.map((v) => v.classificationName)
	};
</script>

<main class="container">
	<div class="space-y-6 bg-white p-6">
		<div class="flex flex-col-reverse items-center gap-3 sm:flex-row">
			<div class="flex w-full items-center gap-x-2 sm:max-w-xs">
				<Input
					class="rounded-sm border-0 bg-gray-100 px-4 py-6 text-gray-500"
					placeholder="Search"
					type="text"
					bind:value={searchInput}
				/>

				{#key data}
					<ItemFilter {...filterSelect} />
				{/key}
			</div>
			<div class="ml-auto flex items-center gap-x-2">
				<ExportBtn fileName="inventory-items" data={data.equipments} class="h-9 rounded-md px-3" />
				<Button href="/admin/inventory/new" size="sm">Add</Button>
			</div>
		</div>

		<ItemDataTable data={data.equipments} bind:searchInput />
	</div>
</main>
