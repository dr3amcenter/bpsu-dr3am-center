<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	type $$Props = HTMLAttributes<HTMLTableRowElement> & {
		"data-state"?: unknown;
	};

	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<tr
	class={cn(
		"border-t-8 border-[#fbfaf8] bg-white transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
		className
	)}
	{...$$restProps}
	on:click
	on:keydown
>
	<slot />
</tr>
