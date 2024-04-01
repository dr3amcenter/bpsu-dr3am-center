<script>
	import { Input } from "$lib/components/ui/input";
	import Title from "$lib/components/title.svelte";
	import ClassificationDataTable from "./(components)/classification-data-table.svelte";

	import ClassificationCreateDialog from "./(components)/classification-create-dialog.svelte";

	export let data;

	let searchInput = "";
</script>

<Title title="Classifications" />

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
				<ClassificationCreateDialog theForm={data.newClassificationsForm} />
			</div>
		</div>
		<ClassificationDataTable data={data.classifications} bind:searchInput />
	</div>
</main>
