<script lang="ts">
	import Title from "$lib/components/title.svelte";
	import TransactionsDataTable from "$lib/components/transactions/transaction-data-table.svelte";
	import ExportBtn from "$lib/components/export-btn.svelte";

	import { format } from "date-fns";
	import DateRangePicker from "$lib/components/date-range-picker.svelte";

	export let data;

	$: exportData = data.transactions.map((t) => {
		const { equipment } = t;

		return {
			item: equipment.item,
			type: t.type,
			quantity: t.quantity,
			status: t.status,
			requester: t.requester.fullName,
			approver: t.approver?.fullName,
			date: format(t.updatedAt, "MM-dd-yyyy")
		};
	});
</script>

<Title title="Transaction Report" />

<main class="container">
	<div class="mb-6 space-y-6">
		<div
			class="flex flex-col-reverse justify-end gap-x-3 gap-y-2 rounded-sm border border-primary bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between"
		>
			<div class="flex-1">
				<DateRangePicker />
			</div>

			<div class="flex">
				<div class="ml-auto">
					<ExportBtn data={exportData} fileName="transaction-report" />
				</div>
			</div>
		</div>
	</div>

	<TransactionsDataTable data={data.transactions} />
</main>
