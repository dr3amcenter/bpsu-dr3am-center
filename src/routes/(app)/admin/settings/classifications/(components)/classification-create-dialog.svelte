<script lang="ts">
	import { zodClient } from "sveltekit-superforms/adapters";
	import {
		Fieldset,
		Legend,
		ElementField,
		Control,
		Label,
		FieldErrors,
		Description
	} from "formsnap";
	import * as Dialog from "$lib/components/ui/dialog";
	import { superForm, type SuperValidated, type Infer } from "sveltekit-superforms";
	import { createClassificationsSchema } from "$lib/zod-schemas/classification.schema";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import Input from "$lib/components/ui/input/input.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import { TrashIcon } from "lucide-svelte";
	import FormErrors from "$lib/components/ui/form/form-errors.svelte";
	import { toast } from "svelte-sonner";

	export let theForm: SuperValidated<Infer<typeof createClassificationsSchema>>;

	let open = false;

	const form = superForm(theForm, {
		validators: zodClient(createClassificationsSchema),
		onUpdate(event) {
			if (event.form.valid) {
				open = false;
				toast.success("Classification created successfully");
				return;
			}
		}
	});

	const { form: formData, enhance, errors } = form;

	function removeClassificationByIndex(index: number) {
		$formData.classifications = $formData.classifications.filter((_, i) => i !== index);
	}

	function addClassification() {
		$formData.classifications = [...$formData.classifications, ""];
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants()}>Add</Dialog.Trigger>
	<Dialog.Content class="max-h-[90vh] overflow-auto">
		<Dialog.Header>
			<Dialog.Title>Create a new Classification</Dialog.Title>
		</Dialog.Header>
		<form use:enhance method="POST" action="?/createClassifications">
			<Fieldset {form} name="classifications" class="space-y-2">
				{#each $formData.classifications as _, i}
					<ElementField {form} name="classifications[{i}]">
						<Control let:attrs>
							<Label class="sr-only">Classification {i + 1}</Label>
							<div class="flex items-center gap-x-2">
								<Input {...attrs} bind:value={$formData.classifications[i]} />
								<Button
									size="icon"
									variant="destructive"
									type="button"
									on:click={() => removeClassificationByIndex(i)}
								>
									<TrashIcon />
								</Button>
							</div>
						</Control>
					</ElementField>
				{/each}
				<FormErrors errors={$errors._errors} />
				<div class="flex justify-end">
					<Button type="button" variant="secondary" on:click={addClassification}
						>Add Classification</Button
					>
				</div>
			</Fieldset>

			<Button type="submit">Submit</Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
