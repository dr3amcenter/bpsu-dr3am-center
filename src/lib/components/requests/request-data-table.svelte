<script lang="ts">
	import { createRender, createTable, Render, Subscribe } from "svelte-headless-table";
	import { addPagination } from "svelte-headless-table/plugins";
	import { readable, writable } from "svelte/store";
	import * as Table from "$lib/components/ui/table";
	import Button from "$lib/components/ui/button/button.svelte";

	import type { TransactionWithRelations } from "$lib/server/db/schema";
	import { format } from "date-fns";
	import RequestDataTableActions from "./request-data-table-actions.svelte";

	export let data: TransactionWithRelations[] = [];
	export let hidePagination = false;

	const transactions = writable(data);

	$: $transactions = data;

	const table = createTable(transactions, {
		page: addPagination()
	});

	const columns = table.createColumns([
		table.column({
			accessor: "equipment",
			header: "Item",
			cell: ({ value }) => {
				return value.item;
			}
		}),
		table.column({
			accessor: "quantity",
			header: "Quantity"
		}),
		table.column({
			accessor: "requester",
			header: "Requester",
			cell: ({ value }) => {
				return value.fullName;
			}
		}),
		table.column({
			accessor: "updatedAt",
			header: "Date",
			cell: ({ value }) => {
				const formatted = format(value, "MM-dd-yyyy");
				return formatted;
			}
		}),
		table.column({
			accessor: (transactionValue) => transactionValue,
			header: "",
			cell: ({ value }) => {
				return createRender(RequestDataTableActions, { id: value.id });
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);
	const { pageIndex, hasNextPage, hasPreviousPage } = pluginStates.page;
</script>

<div>
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

	{#if !hidePagination}
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
	{/if}
</div>
