<script lang="ts">
	import { ScanIcon } from "lucide-svelte";
	import { buttonVariants } from "$lib/components/ui/button";
	import * as Dialog from "$lib/components/ui/dialog";
	import { cn } from "$lib/utils";
	import Scanner from "./scanner.svelte";

	export let open = false;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger
		class={cn(
			buttonVariants(),
			"fixed bottom-10 right-10 h-14 w-14 rounded-full border-2 border-primary bg-white fill-primary text-primary shadow-md hover:fill-primary-foreground hover:text-primary-foreground"
		)}><ScanIcon /></Dialog.Trigger
	>
	<Dialog.Content class="flex h-[95vh] w-[95vw] max-w-[100vh] flex-col p-0 sm:h-[90vh] sm:w-[90vw]">
		<div class="flex-1">
			<Scanner />
		</div>
		<div class="absolute bottom-0 h-20 w-full rounded-b-sm bg-red-500"></div>
	</Dialog.Content>
</Dialog.Root>
