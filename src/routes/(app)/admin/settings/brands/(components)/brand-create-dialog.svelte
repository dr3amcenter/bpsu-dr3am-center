<script lang="ts">
	import { zodClient } from "sveltekit-superforms/adapters";
	import { Fieldset, ElementField, Control, Label } from "formsnap";
	import * as Dialog from "$lib/components/ui/dialog";
	import { superForm, type SuperValidated, type Infer } from "sveltekit-superforms";
	import { createBrandsSchema } from "$lib/zod-schemas/brand.schema";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import Input from "$lib/components/ui/input/input.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import { TrashIcon } from "lucide-svelte";
	import FormErrors from "$lib/components/ui/form/form-errors.svelte";
	import { toast } from "svelte-sonner";

	export let theForm: SuperValidated<Infer<typeof createBrandsSchema>>;

	let open = false;

	const form = superForm(theForm, {
		validators: zodClient(createBrandsSchema),
		onUpdate(event) {
			if (event.form.valid) {
				open = false;
				toast.success("Brand created successfully");
				return;
			}
		}
	});

	const { form: formData, enhance, errors } = form;

	function removeBrandByIndex(index: number) {
		$formData.brands = $formData.brands.filter((_, i) => i !== index);
	}

	function addBrand() {
		$formData.brands = [...$formData.brands, ""];
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants()}>Add brand</Dialog.Trigger>
	<Dialog.Content class="max-h-[90vh] overflow-auto">
		<Dialog.Header>
			<Dialog.Title>Create a new Brand</Dialog.Title>
		</Dialog.Header>
		<form use:enhance method="POST" action="?/createBrands">
			<Fieldset {form} name="brands" class="space-y-2">
				{#each $formData.brands as _, i}
					<ElementField {form} name="brands[{i}]">
						<Control let:attrs>
							<Label class="sr-only">Brand {i + 1}</Label>
							<div class="flex items-center gap-x-2">
								<Input {...attrs} bind:value={$formData.brands[i]} />
								<Button
									size="icon"
									variant="destructive"
									type="button"
									on:click={() => removeBrandByIndex(i)}
								>
									<TrashIcon />
								</Button>
							</div>
						</Control>
					</ElementField>
				{/each}
				<FormErrors errors={$errors._errors} />
				<div class="flex justify-end">
					<Button type="button" variant="secondary" on:click={addBrand}>Add Brand</Button>
				</div>
			</Fieldset>

			<Button type="submit">Submit</Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
