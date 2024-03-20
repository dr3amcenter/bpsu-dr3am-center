<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import * as Collapsible from "$lib/components/ui/collapsible/index.js";
	import { cn } from "$lib/utils";

	import { page } from "$app/stores";
	import type { BaseLink } from "$lib/config";
	import { ChevronDownIcon } from "lucide-svelte";

	export let href: `/${string}`;
	export let label: string;
	export let sublinks: BaseLink[] = [];

	let open = sublinks.some((sublink) => $page.url.pathname.startsWith(sublink.href));
</script>

{#if sublinks.length > 0}
	<Collapsible.Root {open}>
		<Collapsible.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				variant="ghost"
				class={cn(
					"h-10 w-full items-center justify-start gap-x-3 rounded-sm",
					$page.url.pathname.startsWith(href)
						? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
						: ""
				)}
			>
				<slot />
				{label}
				<ChevronDownIcon class="ml-auto h-4 w-4" />
				<span class="sr-only">Toggle</span>
			</Button>
		</Collapsible.Trigger>
		<Collapsible.Content class="my-2 ml-6 flex flex-col items-center gap-y-2 border-l-2">
			{#each sublinks as sublink}
				<Button
					variant="ghost"
					href={sublink.href}
					class={cn(
						"h-9 w-[95%] items-center justify-start gap-x-3 rounded-sm text-xs",
						$page.url.pathname.startsWith(sublink.href)
							? "bg-sky-100 text-sky-400 hover:bg-sky-100 hover:text-sky-400"
							: ""
					)}
				>
					{sublink.label}
				</Button>
			{/each}
		</Collapsible.Content>
	</Collapsible.Root>
{:else}
	<Button
		variant="ghost"
		{href}
		class={cn(
			"h-10 w-full items-center justify-start gap-x-3 rounded-sm",
			$page.url.pathname.startsWith(href)
				? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
				: ""
		)}
	>
		<slot />
		{label}
	</Button>
{/if}
