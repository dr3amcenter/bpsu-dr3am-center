<script lang="ts">
	import { zodClient } from "sveltekit-superforms/adapters";
	import { Fieldset, ElementField, Control, Label } from "formsnap";
	import * as Dialog from "$lib/components/ui/dialog";
	import { superForm, type SuperValidated, type Infer } from "sveltekit-superforms";
	import { createLocationsSchema } from "$lib/zod-schemas/location.schema";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import Input from "$lib/components/ui/input/input.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import { TrashIcon } from "lucide-svelte";
	import FormErrors from "$lib/components/ui/form/form-errors.svelte";
	import { toast } from "svelte-sonner";

	export let theForm: SuperValidated<Infer<typeof createLocationsSchema>>;

	let open = false;

	const form = superForm(theForm, {
		validators: zodClient(createLocationsSchema),
		onUpdate(event) {
			if (event.form.valid) {
				open = false;
				toast.success("Location created successfully");
				return;
			}
		}
	});

	const { form: formData, enhance, errors } = form;

	function removeLocationByIndex(index: number) {
		$formData.locations = $formData.locations.filter((_, i) => i !== index);
	}

	function addLocation() {
		$formData.locations = [...$formData.locations, ""];
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants()}>Add location</Dialog.Trigger>
	<Dialog.Content class="max-h-[90vh] overflow-auto">
		<Dialog.Header>
			<Dialog.Title>Create a new Location</Dialog.Title>
		</Dialog.Header>
		<form use:enhance method="POST" action="?/createLocations">
			<Fieldset {form} name="locations" class="space-y-2">
				{#each $formData.locations as _, i}
					<ElementField {form} name="locations[{i}]">
						<Control let:attrs>
							<Label class="sr-only">Location {i + 1}</Label>
							<div class="flex items-center gap-x-2">
								<Input {...attrs} bind:value={$formData.locations[i]} />
								<Button
									size="icon"
									variant="destructive"
									type="button"
									on:click={() => removeLocationByIndex(i)}
								>
									<TrashIcon />
								</Button>
							</div>
						</Control>
					</ElementField>
				{/each}
				<FormErrors errors={$errors._errors} />
				<div class="flex justify-end">
					<Button type="button" variant="secondary" on:click={addLocation}>Add Location</Button>
				</div>
			</Fieldset>

			<Button type="submit">Submit</Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
