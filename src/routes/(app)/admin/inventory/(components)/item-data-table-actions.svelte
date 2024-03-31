<script lang="ts">
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import { EllipsisIcon } from "lucide-svelte";
	import * as Dialog from "$lib/components/ui/dialog/index";
	import ItemAddIncomingDialog from "./item-add-incoming-dialog.svelte";
	import { cn } from "$lib/utils";
	import ItemAddOutgoingDialog from "./item-add-outgoing-dialog.svelte";

	export let id: string;
	export let equipmentName: string;
	export let onHand: number;
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative h-6 w-6 p-0">
			<span class="sr-only">Open menu</span>
			<EllipsisIcon class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Actions</DropdownMenu.Label>
			<DropdownMenu.Item href="/admin/inventory/{id}">View Details</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<ItemAddIncomingDialog {equipmentName} equipmentId={id}>
			<Dialog.Trigger
				class={cn(buttonVariants({ variant: "ghost", size: "sm" }), "px-2 py-1.5 text-sm")}
				slot="trigger-slot">Add Incoming</Dialog.Trigger
			>
		</ItemAddIncomingDialog>

		<ItemAddOutgoingDialog {onHand} {equipmentName} equipmentId={id}>
			<Dialog.Trigger
				class={cn(buttonVariants({ variant: "ghost", size: "sm" }), "px-2 py-1.5 text-sm")}
				slot="trigger-slot">Add Outgoing</Dialog.Trigger
			>
		</ItemAddOutgoingDialog>
	</DropdownMenu.Content>
</DropdownMenu.Root>
