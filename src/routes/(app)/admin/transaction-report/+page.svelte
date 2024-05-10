<script lang="ts">
	import Title from "$lib/components/title.svelte";
	import TransactionsDataTable from "$lib/components/transactions/transaction-data-table.svelte";
	import ExportBtn from "$lib/components/export-btn.svelte";

	import { format } from "date-fns";
	import DateRangePicker from "$lib/components/date-range-picker.svelte";
	import type { DateRange } from "bits-ui";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import Button from "$lib/components/ui/button/button.svelte";

	export let data;

	let value: DateRange | undefined;

	$: exportData = data.transactions.map((t) => {
		const { equipment } = t;

		return {
			item: equipment.item,
			type: t.type,
			quantity: t.quantity,
			status: t.status,
			requester: t.requester.fullName,
			approver: t.approver?.fullName,
			date: format(t.updatedAt, "MM-dd-yyyy - hh:mm a")
		};
	});

	$: {
		if (value) {
			const url = $page.url.pathname;
			const params = new URLSearchParams();
			if (value.start) {
				params.append("startDate", value.start.toString());
			}

			if (value.end) {
				params.append("endDate", value.end.toString());
			}

			goto(`${url}?${params}`, { replaceState: true });
		}
	}

	function clearFilter() {
		value = undefined;
		const params = new URLSearchParams();
		const url = $page.url.pathname;

		goto(`${url}?${params}`, { replaceState: true });
	}
</script>

<Title title="Transaction Report" />

<main class="container">
	<div class="space-y-6 bg-white p-6">
		<div
			class="flex flex-col-reverse justify-end gap-x-3 gap-y-2 sm:flex-row sm:items-center sm:justify-between"
		>
			<div class="flex flex-1 items-center gap-x-2">
				<DateRangePicker bind:value />
				<Button variant="link" class="underline" on:click={clearFilter}>Clear</Button>
			</div>

			<div class="flex">
				<div class="ml-auto">
					<ExportBtn data={exportData} fileName="transaction-report" />
				</div>
			</div>
		</div>

		<TransactionsDataTable data={data.transactions} />
	</div>
</main>
