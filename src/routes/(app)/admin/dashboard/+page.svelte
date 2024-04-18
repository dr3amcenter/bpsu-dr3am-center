<script lang="ts">
	import CategoryBarchart from "$lib/components/category-barchart.svelte";
	import RequestDataTable from "$lib/components/requests/request-data-table.svelte";
	import TransactionDataTable from "$lib/components/transactions/transaction-data-table.svelte";
	import * as Select from "$lib/components/ui/select";
	import Progress from "$lib/components/ui/progress/progress.svelte";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import { checkExpiration, groupBy } from "$lib/utils";
	import { availabilities } from "$lib/config.js";

	export let data;

	let outerWidth = 0;

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

	$: expiredItemIn30DaysTotal = data.items.filter((item) => {
		if (item.expiryDate) {
			if (checkExpiration(item.expiryDate).isExpiredWithin30Days) {
				return true;
			}
		}

		return false;
	}).length;

	$: expiredItemIn6MonthsTotal = data.items.filter((item) => {
		if (item.expiryDate) {
			if (checkExpiration(item.expiryDate).isExpiredWithin6Months) {
				return true;
			}
		}

		return false;
	}).length;

	$: lowStockItemTotal = data.items.filter((item) => {
		return item.availability === "Out of Stocks" || item.onHand === 0;
	}).length;

	$: consumableItemTotal = data.items.filter((item) => {
		return item.consumability === "Consumable";
	}).length;

	$: forRepairItemTotal = data.items.filter((item) => {
		return item.availability === "For Repair";
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

	let selectedAvailability = {
		label: "Available",
		value: "Available"
	};

	$: chartData = data.items.filter(
		({ availability }) => availability === selectedAvailability.value
	);

	let chartResponseTrigger = "1";

	$: if (outerWidth >= 800) {
		chartResponseTrigger = "2";
	} else {
		chartResponseTrigger = "3";
	}

	$: chartResponseTrigger = selectedAvailability.value;
</script>

<svelte:window bind:outerWidth />

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
		<div class="w-full max-w-[360px] space-y-4 rounded-lg border bg-white px-8 py-6">
			<h3>Inventory Details</h3>
			<div class="space-y-5">
				<div class="flex items-center justify-between">
					<div class="text-xs font-light text-gray-500">Low Stock Items</div>
					<a
						href="/admin/inventory?availabilities=Out+of+Stocks"
						class="text-lg font-semibold text-primary underline underline-offset-4"
						>{lowStockItemTotal}</a
					>
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
							{Math.floor((100 * activeItemTotal) / (itemTotal || 1))}%
						</div>
					</div>
					<Progress value={activeItemTotal} max={itemTotal || 1} class="h-1" />
				</div>
			</div>
		</div>

		<div class="flex-1 space-y-4 rounded-lg border bg-white px-8 py-6">
			<div class="flex items-center justify-between">
				<h3>Category Chart</h3>

				<Select.Root
					selected={selectedAvailability}
					onSelectedChange={(v) => {
						v && (selectedAvailability = { label: v.value, value: v.value });
					}}
				>
					<Select.Trigger
						class="h-8 w-[120px] items-start px-2 sm:h-10 sm:w-[180px] sm:items-center sm:px-3"
					>
						<Select.Value placeholder="Availability" />
					</Select.Trigger>
					<Select.Content>
						{#each availabilities as availability}
							<Select.Item value={availability}>{availability}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			{#key chartResponseTrigger}
				<CategoryBarchart data={chartData} {outerWidth} />
			{/key}
		</div>
	</div>

	<div class="flex flex-col gap-8 xl:flex-row xl:items-start">
		<div class="w-full max-w-[360px] space-y-4 rounded-lg border bg-white px-8 py-6">
			<h3>Item Breakdown</h3>
			<div class="space-y-5">
				<div class="flex items-center justify-between">
					<div class="text-xs font-light text-gray-500">Expired Items</div>
					<a
						href="/admin/inventory?hasExpired=true"
						class="text-lg font-semibold text-primary underline underline-offset-4"
						>{expiredItemTotal}</a
					>
				</div>

				<Separator class="h-[.5px]" />

				<div class="flex items-center justify-between">
					<div class="text-xs font-light text-gray-500">Expired Item in 30 Days</div>
					<a
						href="/admin/inventory?hasExpiredin30D=true"
						class="text-lg font-semibold text-primary underline underline-offset-4"
						>{expiredItemIn30DaysTotal}</a
					>
				</div>

				<Separator class="h-[.5px]" />

				<div class="flex items-center justify-between">
					<div class="text-xs font-light text-gray-500">Expired Item in 6 Months</div>
					<a
						href="/admin/inventory?hasExpiredin6M=true"
						class="text-lg font-semibold text-primary underline underline-offset-4"
						>{expiredItemIn6MonthsTotal}</a
					>
				</div>

				<Separator class="h-[.5px]" />

				<div class="flex items-center justify-between">
					<div class="text-xs font-light text-gray-500">Consumable Items</div>
					<a
						href="/admin/inventory?consumabilities=Consumable"
						class="text-lg font-semibold text-primary underline underline-offset-4"
						>{consumableItemTotal}</a
					>
				</div>

				<Separator class="h-[.5px]" />

				<div class="flex items-center justify-between">
					<div class="text-xs font-light text-gray-500">For Repair Items</div>
					<a
						href="/admin/inventory?hasExpired=true"
						class="text-lg font-semibold text-primary underline underline-offset-4"
						>{forRepairItemTotal}</a
					>
				</div>
			</div>
		</div>

		<div class="flex-1 space-y-4 rounded-lg border bg-white px-8 py-6">
			<div class="flex items-center justify-between">
				<h3>Notifications</h3>

				<a href="/admin/request" class="text-xs text-primary underline underline-offset-4"
					>See All</a
				>
			</div>

			<RequestDataTable data={data.outgoingRequests} hidePagination />
		</div>
	</div>

	<div class="space-y-4 rounded-lg border bg-white px-8 py-6">
		<div class="flex items-center justify-between">
			<h3>Transactions Report</h3>

			<a href="/admin/transaction-report" class="text-xs text-primary underline underline-offset-4"
				>See All</a
			>
		</div>

		<TransactionDataTable data={data.transactions} hidePagination />
	</div>
</main>
