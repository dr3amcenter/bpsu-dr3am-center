<script>
	import { Input } from "$lib/components/ui/input";
	import Title from "$lib/components/title.svelte";
	import ClassificationDataTable from "./(components)/classification-data-table.svelte";

	import ClassificationCreateDialog from "./(components)/classification-create-dialog.svelte";

	export let data;

	let searchInput = "";
</script>

<Title title="Classifications" />

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
			<div class="ml-auto">
				<ClassificationCreateDialog theForm={data.newClassificationsForm} />
			</div>
		</div>
	</div>

	<ClassificationDataTable data={data.classifications} bind:searchInput />
</main>
