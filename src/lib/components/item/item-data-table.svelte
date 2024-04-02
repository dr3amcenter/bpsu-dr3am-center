<script lang="ts">
	import { createRender, createTable, Render, Subscribe } from "svelte-headless-table";
	import { addPagination, addTableFilter, addHiddenColumns } from "svelte-headless-table/plugins";
	import { writable } from "svelte/store";
	import * as Table from "$lib/components/ui/table";
	import ItemDataTableActions from "./item-data-table-actions.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";

	import Outgoing from "$lib/components/outgoing.svelte";
	import Incoming from "$lib/components/incoming.svelte";
	import OnHand from "$lib/components/onHand.svelte";
	import type { Equipment } from "$lib/server/db/schema";
	import { format } from "date-fns";
	import { ChevronDownIcon } from "lucide-svelte";
	import { getFrequency } from "$lib/utils";

	export let searchInput = "";

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
			header: "Location",
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: "availability",
			header: "Availability",
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: "consumability",
			header: "Consumability",
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: "category",
			header: "Category",
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: "brand",
			header: "Brand",
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: "classification",
			header: "Classification",
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: "dateAcquired",
			header: "Acquired Date",
			cell: ({ value }) => {
				if (!value) return "";
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
			accessor: "expiryDate",
			header: "Expiry Date",
			cell: ({ value }) => {
				if (!value) return "";
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
			accessor: "acquisitionCost",
			header: "Acquisition Cost",
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: "maintenanceCost",
			header: "Maintenance Cost",
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: "maintenanceInMonths",
			header: "Maintenance In Months",
			cell: ({ value }) => {
				if (!value) return 0;
				return getFrequency(value);
			},
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: "code",
			header: "Code"
		}),
		table.column({
			accessor: "serialNumber",
			header: "Serial Number"
		}),
		table.column({
			accessor: "controlNumber",
			header: "Control Number"
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

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, flatColumns } =
		table.createViewModel(columns);
	const { pageIndex, hasNextPage, hasPreviousPage } = pluginStates.page;
	const { filterValue } = pluginStates.filter;
	const { hiddenColumnIds } = pluginStates.hide;

	const hidableCols = [
		"consumability",
		"category",
		"brand",
		"classification",
		"dateAcquired",
		"expiryDate",
		"acquisitionCost",
		"maintenanceCost",
		"maintenanceInMonths",
		"code",
		"controlNumber",
		"serialNumber"
	];

	const ids = flatColumns.map((col) => col.id);
	let hideForId = Object.fromEntries(
		ids.map((id) => {
			if (hidableCols.find((v) => v === id)) {
				return [id, false];
			}

			return [id, true];
		})
	);

	$: $hiddenColumnIds = Object.entries(hideForId)
		.filter(([, hide]) => !hide)
		.map(([id]) => id);

	$: $filterValue = searchInput;
</script>

<div>
	<div class="flex">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button variant="outline" class="ml-auto" builders={[builder]}>
					Columns <ChevronDownIcon class="ml-2 h-4 w-4" />
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				{#each flatColumns as col}
					{#if hidableCols.includes(col.id)}
						<DropdownMenu.CheckboxItem bind:checked={hideForId[col.id]}>
							{col.header}
						</DropdownMenu.CheckboxItem>
					{/if}
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
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
