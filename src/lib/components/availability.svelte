<script lang="ts">
	import { availabilities } from "$lib/config";
	import Badge from "$lib/components/ui/badge/badge.svelte";

	export let availability: string;
</script>

{#if availability === "Available"}
	<Badge class="bg-green-500 lowercase hover:bg-green-500/80">{availability}</Badge>
{:else if availability === "Not Available"}
	<Badge class="bg-red-500 lowercase text-black hover:bg-red-500/80">{availability}</Badge>
{:else if availability === "Out of Stocks"}
	<Badge class="bg-red-500 lowercase text-black hover:bg-red-500/80">{availability}</Badge>
{:else if availability === "For Repair"}
	<Badge class="bg-yellow-500 lowercase text-black hover:bg-yellow-500/80">{availability}</Badge>
{/if}
