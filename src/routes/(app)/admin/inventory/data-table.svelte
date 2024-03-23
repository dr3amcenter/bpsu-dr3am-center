<script lang="ts">
	import { createRender, createTable, Render, Subscribe } from "svelte-headless-table";
	import { addPagination, addTableFilter } from "svelte-headless-table/plugins";
	import { readable } from "svelte/store";
	import * as Table from "$lib/components/ui/table";
	import DataTableActions from "./data-table-actions.svelte";
	import { Input } from "$lib/components/ui/input";
	import Button from "$lib/components/ui/button/button.svelte";
	import Outgoing from "$lib/components/outgoing.svelte";
	import Incoming from "$lib/components/incoming.svelte";
	import OnHand from "$lib/components/onHand.svelte";

	type Equipment = {
		id: string;
		item: string;
		incoming: number;
		outgoing: number;
		onHand: number;
		location: string;
		category: string;
		availability: string;
	};

	export let data: Equipment[] = [];

	const table = createTable(readable(data), {
		page: addPagination(),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		})
	});

	const columns = table.createColumns([
		table.column({
			accessor: "item",
			header: "Item"
		}),
		table.column({
			accessor: "location",
			header: "Location"
		}),
		table.column({
			accessor: "category",
			header: "Category"
		}),
		table.column({
			accessor: "incoming",
			header: "Incoming",
			cell: ({ value }) => {
				return createRender(Incoming, { num: value });
			},
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: "outgoing",
			header: "Outgoing",
			cell: ({ value }) => {
				return createRender(Outgoing, { num: value });
			},
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: "onHand",
			header: "On Hand",
			cell: ({ value }) => {
				return createRender(OnHand, { num: value });
			},
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: ({ id }) => id,
			header: "",
			cell: ({ value }) => {
				return createRender(DataTableActions, { id: value });
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
</script>

<div>
	<div class="mb-6 space-y-6">
		<div
			class="ml-auto flex items-center gap-x-3 rounded-sm border border-primary bg-white p-6 shadow-sm"
		>
			<Input
				class="max-w-xs rounded-sm border-0 bg-gray-100 px-4 py-6 text-gray-500"
				placeholder="Search"
				type="text"
				bind:value={$filterValue}
			/>
			<Button href="/admin/inventory/new" size="sm" class="ml-auto">Add Equipment</Button>
		</div>
	</div>
	<Table.Root {...$tableAttrs}>
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row class="bg-white">
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
								<Table.Head {...attrs} class="text-primary">
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
								<Table.Cell {...attrs} class="bg-white py-6">
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
