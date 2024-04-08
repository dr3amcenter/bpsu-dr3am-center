<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Form from "$lib/components/ui/form";
	import { deleteItemSchema } from "$lib/zod-schemas/item.schema";
	import { superForm, type SuperValidated, type Infer } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { buttonVariants } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { toast } from "svelte-sonner";

	import { page } from "$app/stores";
	import { LoaderCircleIcon } from "lucide-svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import { cn } from "$lib/utils";

	export let theForm: SuperValidated<Infer<typeof deleteItemSchema>> =
		$page.data.addOutgoingItemForm;

	export let equipmentName: string;
	export let equipmentId: string;

	let open = false;

	const form = superForm(theForm, {
		validators: zodClient(deleteItemSchema),
		id: `delete-item-form-${equipmentId}`,
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

	$: $formData.equipmentId = equipmentId;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger
		class={cn(
			buttonVariants({ variant: "outline" }),
			"border-red-500 text-red-500 hover:bg-red-100 hover:text-red-500"
		)}>Delete Item</Dialog.Trigger
	>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Delete {equipmentName}</Dialog.Title>
			<Dialog.Description
				>Click "Yes" to delete this item (All pending request will be deleted)</Dialog.Description
			>
		</Dialog.Header>
		<form action="?/deleteItem" method="POST" use:enhance class="space-y-4">
			<Form.Field {form} name="equipmentId" class="">
				<Form.Control let:attrs>
					<Input {...attrs} type="hidden" bind:value={$formData.equipmentId} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Errors errors={$errors._errors} />
			<div class="grid grid-cols-2 gap-x-2">
				<Button disabled={$submitting} variant="outline" on:click={() => (open = false)}
					>Cancel</Button
				>
				<Form.Button variant="destructive" disabled={$submitting}>
					{#if $submitting}
						<LoaderCircleIcon class="h-5 w-5 animate-spin" />
					{:else}
						Yes
					{/if}
				</Form.Button>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
