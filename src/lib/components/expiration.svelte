<script lang="ts">
	import { checkExpiration } from "$lib/utils";
	import Badge from "./ui/badge/badge.svelte";

	export let expiryDate: Date | undefined | null;
	export let hasExpired: boolean;

	$: expirationDetails = expiryDate ? checkExpiration(expiryDate) : null;
</script>

{#if hasExpired}
	<Badge variant="outline">expired</Badge>
{:else if expirationDetails}
	{#if expirationDetails.isExpired}
		<Badge variant="outline">expired</Badge>
	{:else if expirationDetails.isExpiredWithin30Days}
		<Badge variant="outline">expired within 30 days</Badge>
	{:else if expirationDetails.isExpiredWithin6Months}
		<Badge variant="outline">expired within 6 months</Badge>
	{/if}
{/if}
