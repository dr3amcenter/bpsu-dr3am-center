<script lang="ts">
	import Availability from "$lib/components/availability.svelte";
	import Expiration from "$lib/components/expiration.svelte";
	import ItemDetails from "$lib/components/item/item-details.svelte";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import ItemAddIncomingDialog from "$lib/components/item/item-add-incoming-dialog.svelte";
	import ItemAddOutgoingDialog from "$lib/components/item/item-add-outgoing-dialog.svelte";
	import TransactionDataTable from "$lib/components/transactions/transaction-data-table.svelte";
	import RequestDataTable from "$lib/components/requests/request-data-table.svelte";
	import Badge from "$lib/components/ui/badge/badge.svelte";
	import Button from "$lib/components/ui/button/button.svelte";

	import { page } from "$app/stores";

	export let data;

	$: ({ item, hasExpired, expiryDate, availability, id, onHand } = data.equipment);

	$: requests = data.transactions.filter((r) => r.status === "pending" && r.type === "outgoing");
	$: transactions = data.transactions.filter((t) => t.status !== "pending");
</script>

<main class="container">
	<div class="space-y-4 bg-white p-4">
		<div class="space-y-2">
			<h2 class="text-lg font-semibold">{item}</h2>
			<div class="flex items-center gap-x-2">
				<Availability {availability} />
				<Expiration {hasExpired} {expiryDate} />
			</div>
			<div class="flex items-center gap-x-2">
				<ItemAddIncomingDialog equipmentId={id} equipmentName={item} />
				<ItemAddOutgoingDialog {onHand} equipmentId={id} equipmentName={item} />
				<Button
					href="/admin/inventory/{$page.params.id}/edit"
					variant="outline"
					size="sm"
					class="h-7 text-xs">Edit</Button
				>
			</div>
		</div>

		<Tabs.Root value="details" class="">
			<Tabs.List class="w-full justify-start rounded-none border-b bg-white p-0">
				<Tabs.Trigger
					class="h-full rounded-none px-2 py-0 text-xs shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none md:px-10 md:text-sm"
					value="details">Item Details</Tabs.Trigger
				>
				<Tabs.Trigger
					class="h-full rounded-none px-2 py-0 text-xs shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none md:px-10 md:text-sm"
					value="transactions">Transactions</Tabs.Trigger
				>
				<Tabs.Trigger
					class="h-full gap-x-1 rounded-none px-2 py-0 text-xs shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none md:px-10 md:text-sm"
					value="requests"
					>Requests <span
						><Badge class="rounded-full">{requests.length > 99 ? "99+" : requests.length}</Badge
						></span
					></Tabs.Trigger
				>
			</Tabs.List>
			<Tabs.Content value="details">
				<ItemDetails equipment={data.equipment} />
			</Tabs.Content>
			<Tabs.Content value="transactions">
				<TransactionDataTable data={transactions} />
			</Tabs.Content>
			<Tabs.Content value="requests">
				<RequestDataTable data={requests} />
			</Tabs.Content>
		</Tabs.Root>
	</div>
</main>
