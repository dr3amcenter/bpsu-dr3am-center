<script lang="ts">
	import type { TransactionStatus } from "$lib/server/db/schema";
	import { DotIcon } from "lucide-svelte";

	export let status: TransactionStatus;
</script>

{#if status === "approved"}
	<div class="flex items-center gap-x-0.5 text-green-500">
		<DotIcon class="h-10 w-10" /> Approved
	</div>
{:else if status === "declined"}
	<div class="flex items-center gap-x-0.5 text-red-500">
		<DotIcon class="h-10 w-10" /> Declined
	</div>
{:else if status === "pending"}
	<div class="flex items-center gap-x-0.5 text-orange-500">
		<DotIcon class="h-10 w-10" /> Pending
	</div>
{/if}
