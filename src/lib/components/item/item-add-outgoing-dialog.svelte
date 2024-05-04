<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Form from "$lib/components/ui/form";
	import { addOutgoingItemSchema } from "$lib/zod-schemas/item.schema";
	import { superForm, type SuperValidated, type Infer } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { buttonVariants } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { toast } from "svelte-sonner";

	import { page } from "$app/stores";
	import { LoaderCircleIcon } from "lucide-svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import { cn } from "$lib/utils";

	export let theForm: SuperValidated<Infer<typeof addOutgoingItemSchema>> =
		$page.data.addOutgoingItemForm;

	export let equipmentName: string;
	export let equipmentId: string;
	export let onHand: number = 0;

	let open = false;
	let openSure = onHand >= 1 && onHand <= 10;

	const form = superForm(theForm, {
		validators: zodClient(addOutgoingItemSchema),
		id: `add-outgoing-form-${equipmentId}`,
		resetForm: false,
		onUpdate(event) {
			if (!event.form.valid) {
				return;
			}
			toast.success("Outgoing request submitted");
			open = false;
		}
	});

	const { form: formData, enhance, errors, submitting } = form;

	$: $formData.id = equipmentId;
</script>

<Dialog.Root bind:open>
	<slot name="trigger-slot">
		<Dialog.Trigger
			class={cn(
				buttonVariants({ variant: "outline", size: "sm" }),
				"h-7 border-red-500 text-xs text-red-500"
			)}>Outgoing</Dialog.Trigger
		>
	</slot>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>New outgoing {equipmentName}</Dialog.Title>
		</Dialog.Header>

		{#if openSure}
			<div class="space-y-4">
				<div>Are you sure you want to get this item? This item is included in low stock items.</div>

				<div class="grid grid-cols-2 gap-x-2">
					<Button variant="outline" on:click={() => (open = false)}>No</Button>
					<Button on:click={() => (openSure = false)}>Yes</Button>
				</div>
			</div>
		{:else}
			<form action="?/addOutgoingItem" method="POST" use:enhance class="space-y-4">
				<div>
					On Hand: <span class={cn(onHand < 10 ? "text-red-500" : "")}>{onHand}</span>
					{#if onHand < 10}
						<div class="text-sm text-red-500">This item is included in low stock items</div>
					{/if}
				</div>

				<Form.Field {form} name="quantity">
					<Form.Control let:attrs>
						<Form.Label>Quantity</Form.Label>
						<Input {...attrs} type="number" bind:value={$formData.quantity} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="id" class="">
					<Form.Control let:attrs>
						<Input {...attrs} type="hidden" bind:value={$formData.id} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Errors errors={$errors._errors} />
				<div class="grid grid-cols-2 gap-x-2">
					<Button disabled={$submitting} variant="outline" on:click={() => (open = false)}
						>Cancel</Button
					>
					<Form.Button disabled={$submitting}>
						{#if $submitting}
							<LoaderCircleIcon class="h-5 w-5 animate-spin" />
						{:else}
							Save
						{/if}
					</Form.Button>
				</div>
			</form>
		{/if}
	</Dialog.Content>
</Dialog.Root>
