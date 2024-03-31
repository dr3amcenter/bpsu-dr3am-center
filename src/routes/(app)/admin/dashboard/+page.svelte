<script lang="ts">
	import RequestDataTable from "$lib/components/requests/request-data-table.svelte";
	import Title from "$lib/components/title.svelte";
	import TransactionDataTable from "$lib/components/transactions/transaction-data-table.svelte";
	import Progress from "$lib/components/ui/progress/progress.svelte";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import { checkExpiration, groupBy } from "$lib/utils";

	export let data;

	$: itemTotal = data.items.length;

	$: groupItemTotal = Object.keys(groupBy(data.items, (obj) => obj.category)).length;

	$: activeItemTotal = data.items.filter((item) => {
		if (item.availability !== "Available") {
			return false;
		}

		if (item.hasExpired) {
			return false;
		}

		if (item.expiryDate) {
			if (checkExpiration(item.expiryDate).isExpired) {
				return false;
			}
		}

		return true;
	}).length;

	$: expiredItemTotal = data.items.filter((item) => {
		if (item.hasExpired) {
			return true;
		}

		if (item.expiryDate) {
			if (checkExpiration(item.expiryDate).isExpired) {
				return true;
			}
		}

		return false;
	}).length;

	$: consumableItemTotal = data.items.filter((item) => {
		return item.consumability === "Consumable";
	}).length;

	$: forRepairItemTotal = data.items.filter((item) => {
		return item.availability === "For Repair";
	}).length;

	$: expiredItemIn30DaysTotal = data.items.filter((item) => {
		if (item.expiryDate) {
			if (checkExpiration(item.expiryDate).isExpiredWithin30Days) {
				return true;
			}
		}

		return false;
	}).length;

	$: outgoingTotal = data.items.reduce(
		(accumulator, currentValue) => accumulator + currentValue.outgoing,
		0
	);

	$: incomingTotal = data.items.reduce(
		(accumulator, currentValue) => accumulator + currentValue.incoming,
		0
	);

	$: onHandTotal = data.items.reduce(
		(accumulator, currentValue) => accumulator + currentValue.onHand,
		0
	);

	$: approvedTotal = data.items.reduce((accumulator, currentValue) => {
		let total = 0;

		currentValue.transactions.forEach((tx) => {
			if (tx.status === "approved") {
				total++;
			}
		});

		return accumulator + total;
	}, 0);

	$: declinedTotal = data.items.reduce((accumulator, currentValue) => {
		let total = 0;

		currentValue.transactions.forEach((tx) => {
			if (tx.status === "declined") {
				total++;
			}
		});

		return accumulator + total;
	}, 0);

	$: requestTotal = data.items.reduce((accumulator, currentValue) => {
		let total = 0;

		currentValue.transactions.forEach((tx) => {
			total++;
		});

		return accumulator + total;
	}, 0);
</script>

<main class="container space-y-8">
	<div class="grid grid-cols-2 gap-y-8">
		<div class="col-span-2 space-y-4 rounded-lg bg-primary px-8 py-4 text-white lg:col-span-1">
			<h2>INVENTORY SUMMARY</h2>
			<div class="grid grid-cols-6 gap-x-10">
				<div class="col-span-2 space-y-2">
					<div class="border-r-2 border-white text-2xl font-semibold">{onHandTotal}</div>
					<div class="text-xs">On Hand</div>
				</div>
				<div class="col-span-2 space-y-2">
					<div class="border-r-2 border-white text-2xl font-semibold">{incomingTotal}</div>
					<div class="text-xs">Incoming</div>
				</div>
				<div class="col-span-2 space-y-2">
					<div class="text-2xl font-semibold">{outgoingTotal}</div>
					<div class="text-xs">Outgoing</div>
				</div>
			</div>
		</div>
		<div
			class="col-span-2 space-y-4 rounded-lg border bg-white px-8 py-4 lg:col-span-1 lg:rounded-l-none lg:border-l-0"
		>
			<h2>ACTIVITY</h2>
			<div class="grid grid-cols-6 gap-x-10">
				<div class="col-span-2 space-y-2">
					<div class="border-r-2 border-white text-2xl font-semibold">{approvedTotal}</div>
					<div class="text-xs">Approved</div>
				</div>
				<div class="col-span-2 space-y-2">
					<div class="border-r-2 border-white text-2xl font-semibold">{declinedTotal}</div>
					<div class="text-xs">Rejected</div>
				</div>
				<div class="col-span-2 space-y-2">
					<div class="text-2xl font-semibold">{requestTotal}</div>
					<div class="text-xs">Request</div>
				</div>
			</div>
		</div>
	</div>
	<div class="flex flex-col justify-start gap-8 xl:flex-row">
		<div class="min-w-[360px] space-y-4 rounded-lg border bg-white px-8 py-6">
			<h3>Inventory Details</h3>
			<div class="space-y-5">
				<div class="flex items-center justify-between">
					<div class="text-xs font-light text-gray-500">Expired Items</div>
					<div class="text-lg font-semibold">20</div>
				</div>
				<Separator class="h-[.5px]" />
				<div class="flex items-center justify-between">
					<div class="text-xs font-light text-gray-500">Item Groups</div>
					<div class="text-lg font-semibold">{groupItemTotal}</div>
				</div>
				<Separator class="h-[.5px]" />

				<div class="flex items-center justify-between">
					<div class="text-xs font-light text-gray-500">Number of Items</div>
					<div class="text-lg font-semibold">{itemTotal}</div>
				</div>
				<Separator class="h-[.5px]" />
				<div>
					<div class="flex items-center justify-between">
						<div class="text-xs font-light text-gray-500">Active Items</div>
						<div class="text-lg font-semibold">
							{Math.floor((100 * (activeItemTotal ?? 0)) / (itemTotal ?? 1))}%
						</div>
					</div>
					<Progress value={activeItemTotal} max={itemTotal} class="h-1" />
				</div>
			</div>
		</div>

		<div class="flex-1 space-y-4 rounded-lg border bg-white px-8 py-6">
			<div class="flex items-center justify-between">
				<h3>Notifications</h3>

				<a href="/admin/request" class="text-xs text-primary underline underline-offset-4"
					>See All Requests</a
				>
			</div>

			<RequestDataTable data={data.outgoingRequests} hidePagination />
		</div>
	</div>

	<div class="flex flex-col gap-8 xl:flex-row xl:items-start">
		<div class="min-w-[360px] space-y-4 rounded-lg border bg-white px-8 py-6">
			<h3>Item Breakdown</h3>
			<div class="space-y-5">
				<div class="flex items-center justify-between">
					<div class="text-xs font-light text-gray-500">Expired Items</div>
					<div class="text-lg font-semibold">{expiredItemTotal}</div>
				</div>
				<Separator class="h-[.5px]" />
				<div class="flex items-center justify-between">
					<div class="text-xs font-light text-gray-500">Expired Item in 30 Days</div>
					<div class="text-lg font-semibold">{expiredItemIn30DaysTotal}</div>
				</div>
				<Separator class="h-[.5px]" />

				<div class="flex items-center justify-between">
					<div class="text-xs font-light text-gray-500">Consumable Items</div>
					<div class="text-lg font-semibold">{consumableItemTotal}</div>
				</div>
				<Separator class="h-[.5px]" />

				<div class="flex items-center justify-between">
					<div class="text-xs font-light text-gray-500">For Repair Items</div>
					<div class="text-lg font-semibold">{forRepairItemTotal}</div>
				</div>
			</div>
		</div>

		<div class="flex-1 space-y-4 rounded-lg border bg-white px-8 py-6">
			<div class="flex items-center justify-between">
				<h3>Transactions Report</h3>

				<a
					href="/admin/transaction-report"
					class="text-xs text-primary underline underline-offset-4">See All Transaction</a
				>
			</div>

			<TransactionDataTable data={data.transactions} hidePagination />
		</div>
	</div>
</main>
