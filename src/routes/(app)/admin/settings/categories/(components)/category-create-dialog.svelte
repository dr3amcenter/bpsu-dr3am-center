<script lang="ts">
	import { zodClient } from "sveltekit-superforms/adapters";
	import { Fieldset, ElementField, Control, Label } from "formsnap";
	import * as Dialog from "$lib/components/ui/dialog";
	import { superForm, type SuperValidated, type Infer } from "sveltekit-superforms";
	import { createCategoriesSchema } from "$lib/zod-schemas/category.schema";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import Input from "$lib/components/ui/input/input.svelte";
	import Button from "$lib/components/ui/button/button.svelte";
	import { TrashIcon } from "lucide-svelte";
	import FormErrors from "$lib/components/ui/form/form-errors.svelte";
	import { toast } from "svelte-sonner";

	export let theForm: SuperValidated<Infer<typeof createCategoriesSchema>>;

	let open = false;

	const form = superForm(theForm, {
		validators: zodClient(createCategoriesSchema),
		onUpdate(event) {
			if (event.form.valid) {
				open = false;
				toast.success("Category created successfully");
				return;
			}
		}
	});

	const { form: formData, enhance, errors } = form;

	function removeCategoryByIndex(index: number) {
		$formData.categories = $formData.categories.filter((_, i) => i !== index);
	}

	function addCategory() {
		$formData.categories = [...$formData.categories, ""];
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants()}>Add</Dialog.Trigger>
	<Dialog.Content class="max-h-[90vh] overflow-auto">
		<Dialog.Header>
			<Dialog.Title>Create a new Category</Dialog.Title>
		</Dialog.Header>
		<form use:enhance method="POST" action="?/createCategories">
			<Fieldset {form} name="categories" class="space-y-2">
				{#each $formData.categories as _, i}
					<ElementField {form} name="categories[{i}]">
						<Control let:attrs>
							<Label class="sr-only">Category {i + 1}</Label>
							<div class="flex items-center gap-x-2">
								<Input {...attrs} bind:value={$formData.categories[i]} />
								<Button
									size="icon"
									variant="destructive"
									type="button"
									on:click={() => removeCategoryByIndex(i)}
								>
									<TrashIcon />
								</Button>
							</div>
						</Control>
					</ElementField>
				{/each}
				<FormErrors errors={$errors._errors} />
				<div class="flex justify-end">
					<Button type="button" variant="secondary" on:click={addCategory}>Add Category</Button>
				</div>
			</Fieldset>

			<Button type="submit">Submit</Button>
		</form>
	</Dialog.Content>
</Dialog.Root>
