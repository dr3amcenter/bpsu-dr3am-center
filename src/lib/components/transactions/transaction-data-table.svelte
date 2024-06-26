<script lang="ts">
	import { createRender, createTable, Render, Subscribe } from "svelte-headless-table";
	import { addPagination, addSortBy } from "svelte-headless-table/plugins";
	import { writable } from "svelte/store";
	import ArrowUpDown from "lucide-svelte/icons/arrow-up-down";
	import * as Table from "$lib/components/ui/table";
	import Button from "$lib/components/ui/button/button.svelte";

	import type { TransactionWithRelations } from "$lib/server/db/schema";
	import { format } from "date-fns";
	import TransactionStatus from "./transaction-status.svelte";

	export let data: TransactionWithRelations[] = [];

	export let hidePagination = false;

	const transactions = writable(data);

	$: $transactions = data;

	const table = createTable(transactions, {
		page: addPagination(),
		sort: addSortBy()
	});

	const columns = table.createColumns([
		table.column({
			accessor: "equipment",
			header: "Item",
			cell: ({ value }) => {
				return value.item;
			},
			plugins: {
				sort: {
					disable: true
				}
			}
		}),
		table.column({
			accessor: "type",
			header: "Type",
			plugins: {
				sort: {
					disable: true
				}
			}
		}),
		table.column({
			accessor: "quantity",
			header: "Quantity"
		}),
		table.column({
			accessor: "status",
			header: "Status",
			cell: ({ value }) => {
				return createRender(TransactionStatus, { status: value });
			},
			plugins: {
				sort: {
					disable: true
				}
			}
		}),
		table.column({
			accessor: "requester",
			header: "Requester",
			cell: ({ value }) => {
				return value.fullName;
			},
			plugins: {
				sort: {
					disable: true
				}
			}
		}),
		table.column({
			accessor: "approver",
			header: "Approver",
			cell: ({ value }) => {
				return value?.fullName ? value.fullName : "";
			},
			plugins: {
				sort: {
					disable: true
				}
			}
		}),
		table.column({
			accessor: "updatedAt",
			header: "Date",
			cell: ({ value }) => {
				const formatted = format(value, "MM-dd-yyyy - hh:mm a");
				return formatted;
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
					<Table.Row class="border-none">
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
								<Table.Head {...attrs} class="text-primary">
									{#if cell.id === "quantity" || cell.id === "updatedAt"}
										<Button variant="ghost" on:click={props.sort.toggle}>
											<Render of={cell.render()} />
											<ArrowUpDown class={"ml-2 h-4 w-4"} />
										</Button>
									{:else}
										<Render of={cell.render()} />
									{/if}
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
		<div class="flex h-20 items-center justify-center">No data</div>
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
