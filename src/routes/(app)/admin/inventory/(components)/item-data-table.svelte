<script lang="ts">
	import { createRender, createTable, Render, Subscribe } from "svelte-headless-table";
	import { addPagination, addTableFilter, addHiddenColumns } from "svelte-headless-table/plugins";
	import { writable } from "svelte/store";
	import * as Table from "$lib/components/ui/table";
	import ItemDataTableActions from "./item-data-table-actions.svelte";
	import { Input } from "$lib/components/ui/input";
	import Button from "$lib/components/ui/button/button.svelte";
	import Outgoing from "$lib/components/outgoing.svelte";
	import Incoming from "$lib/components/incoming.svelte";
	import OnHand from "$lib/components/onHand.svelte";
	import type { Equipment } from "$lib/server/db/schema";
	import { format } from "date-fns";

	export let data: Equipment[] = [];

	const equipments = writable(data);

	$: $equipments = data;

	const table = createTable(equipments, {
		page: addPagination(),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		}),
		hide: addHiddenColumns()
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
			accessor: "updatedAt",
			header: "Last updated",
			cell: ({ value }) => {
				const formatted = format(value, "MM-dd-yyyy");
				return formatted;
			},
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: (equipmentValue) => equipmentValue,
			header: "",
			cell: ({ value }) => {
				return createRender(ItemDataTableActions, {
					id: value.id,
					equipmentName: value.item,
					onHand: value.onHand
				});
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

<div class="bg-white p-6">
	<div class="mb-6 space-y-6">
		<div class="flex items-center gap-x-3">
			<Input
				class="max-w-xs rounded-sm border-0 bg-gray-100 px-4 py-6 text-gray-500"
				placeholder="Search"
				type="text"
				bind:value={$filterValue}
			/>
			<Button href="/admin/inventory/new" size="sm" class="ml-auto">Add</Button>
		</div>
	</div>
	<Table.Root {...$tableAttrs}>
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row class="border-none">
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
								<Table.Cell {...attrs} class="py-6">
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
