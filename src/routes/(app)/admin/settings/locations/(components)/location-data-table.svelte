<script lang="ts">
	import { createRender, createTable, Render, Subscribe } from "svelte-headless-table";
	import { addPagination, addTableFilter } from "svelte-headless-table/plugins";
	import { writable } from "svelte/store";
	import * as Table from "$lib/components/ui/table";
	import { format } from "date-fns";
	import LocationDataTableActions from "./location-data-table-actions.svelte";
	import Button from "$lib/components/ui/button/button.svelte";

	export let data: {
		locationName: string;
		createdAt: Date;
		updatedAt: Date;
	}[] = [];

	export let searchInput = "";

	const locations = writable(data);

	$: $locations = data;

	const table = createTable(locations, {
		page: addPagination(),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		})
	});

	const columns = table.createColumns([
		table.column({
			accessor: "locationName",
			header: "Location"
		}),

		table.column({
			accessor: "createdAt",
			header: "Created At",
			cell: ({ value }) => {
				const formatted = format(value, "MM-dd-yyyy - hh:mm a");
				return formatted;
			},
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: "updatedAt",
			header: "Updated At",
			cell: ({ value }) => {
				const formatted = format(value, "MM-dd-yyyy - hh:mm a");
				return formatted;
			},
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: (location) => location,
			header: "",
			cell: ({ value }) => {
				return createRender(LocationDataTableActions, { locationName: value.locationName });
			},
			plugins: {
				filter: {
					exclude: true
				}
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);
	const { pageIndex, hasNextPage, hasPreviousPage } = pluginStates.page;
	const { filterValue } = pluginStates.filter;

	$: $filterValue = searchInput;
</script>

<div>
	<Table.Root {...$tableAttrs}>
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row class="border-none">
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
								<Table.Head {...attrs}>
									<Render of={cell.render()} />
								</Table.Head>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Header>
		<Table.Body {...$tableBodyAttrs}>
			{#each $pageRows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<Table.Row {...rowAttrs}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<Table.Cell {...attrs}>
									<Render of={cell.render()} />
								</Table.Cell>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Body>
	</Table.Root>

	{#if data.length === 0}
		<div class="flex h-20 items-center justify-center bg-white">No data</div>
	{/if}

	<div class="flex items-center justify-end space-x-4 py-4">
		<Button
			variant="outline"
			size="sm"
			on:click={() => ($pageIndex = $pageIndex - 1)}
			disabled={!$hasPreviousPage}>Previous</Button
		>
		<Button
			variant="outline"
			size="sm"
			disabled={!$hasNextPage}
			on:click={() => ($pageIndex = $pageIndex + 1)}>Next</Button
		>
	</div>
</div>
