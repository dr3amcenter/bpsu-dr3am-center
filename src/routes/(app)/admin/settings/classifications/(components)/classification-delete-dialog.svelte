<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Form from "$lib/components/ui/form";
	import { deleteClassificationSchema } from "$lib/zod-schemas/classification.schema";
	import { superForm, type SuperValidated, type Infer } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { buttonVariants } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { toast } from "svelte-sonner";
	import { LoaderCircleIcon, TrashIcon } from "lucide-svelte";
	import Button from "$lib/components/ui/button/button.svelte";

	import { page } from "$app/stores";
	import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";

	export let theForm: SuperValidated<Infer<typeof deleteClassificationSchema>> =
		$page.data.deleteClassificationForm;

	export let classificationName: string;

	let open = false;

	const form = superForm(theForm, {
		validators: zodClient(deleteClassificationSchema),
		id: `delete-classification-form-${classificationName}`,
		onUpdate(event) {
			if (!event.form.valid) {
				return;
			}
			toast.success("Classification has been deleted");
			open = false;
		}
	});

	const { form: formData, enhance, submitting } = form;

	$: $formData.classificationName = classificationName;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: "ghost", size: "icon" })}>
		<TrashIcon class="h-5 w-5" />
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Delete Classification "{classificationName}"?</Dialog.Title>
		</Dialog.Header>
		<form action="?/deleteClassification" method="POST" use:enhance class="space-y-4">
			<Form.Field {form} name="classificationName">
				<Form.Control let:attrs>
					<Input {...attrs} type="hidden" bind:value={$formData.classificationName} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field
				{form}
				name="cascade"
				class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
			>
				<Form.Control let:attrs>
					<Checkbox {...attrs} bind:checked={$formData.cascade} />
					<div class="space-y-1 leading-none">
						<Form.Label>Also delete equipment in this classification</Form.Label>
					</div>
					<input name={attrs.name} value={$formData.cascade} type="hidden" />
				</Form.Control>
			</Form.Field>
			<div class="grid grid-cols-2 gap-x-2">
				<Button disabled={$submitting} variant="outline" on:click={() => (open = false)}
					>Cancel</Button
				>
				<Form.Button disabled={$submitting}>
					{#if $submitting}
						<LoaderCircleIcon class="h-5 w-5 animate-spin" />
					{:else}
						Delete
					{/if}
				</Form.Button>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
