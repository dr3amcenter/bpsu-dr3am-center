<script lang="ts">
	import { cn } from "$lib/utils";

	export let status: "active" | "inactive";
</script>

<div
	class={cn(
		"inline-flex min-w-24 rounded-lg px-3 py-2 text-xs font-medium capitalize",
		status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
	)}
>
	<div class="flex w-full items-center justify-center">
		{status}
	</div>
</div>
