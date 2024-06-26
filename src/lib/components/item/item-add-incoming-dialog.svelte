<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Form from "$lib/components/ui/form";
	import { addIncomingItemSchema } from "$lib/zod-schemas/item.schema";
	import { superForm, type SuperValidated, type Infer } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { buttonVariants } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { toast } from "svelte-sonner";

	import { page } from "$app/stores";
	import { LoaderCircleIcon } from "lucide-svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import { cn } from "$lib/utils";

	export let theForm: SuperValidated<Infer<typeof addIncomingItemSchema>> =
		$page.data.addIncomingItemForm;

	export let equipmentName: string;
	export let equipmentId: string;

	let open = false;

	const form = superForm(theForm, {
		validators: zodClient(addIncomingItemSchema),
		id: `add-incoming-form-${equipmentId}`,
		resetForm: false,
		onUpdate(event) {
			if (!event.form.valid) {
				return;
			}
			toast.success("Incoming request submitted");
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
				"h-7 border-green-500 text-xs text-green-500"
			)}>Incoming</Dialog.Trigger
		>
	</slot>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>New incoming {equipmentName}</Dialog.Title>
		</Dialog.Header>
		<form action="?/addIncomingItem" method="POST" use:enhance class="space-y-4">
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
	</Dialog.Content>
</Dialog.Root>
