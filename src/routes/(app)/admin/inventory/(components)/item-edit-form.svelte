<script lang="ts">
	import * as Form from "$lib/components/ui/form";
	import { editItemSchema } from "$lib/zod-schemas/item.schema";
	import { superForm, type SuperValidated, type Infer } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import * as Select from "$lib/components/ui/select/index.js";
	import { Input } from "$lib/components/ui/input";
	import { Textarea } from "$lib/components/ui/textarea/index.js";
	import Separator from "$lib/components/ui/separator/separator.svelte";
	import { availabilities, consumabilities } from "$lib/config";
	import { Button } from "$lib/components/ui/button";
	import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
	import { toast } from "svelte-sonner";
	import { page } from "$app/stores";
	import type { Equipment } from "$lib/server/db/schema";
	import { format } from "date-fns";

	export let theForm: SuperValidated<Infer<typeof editItemSchema>> = $page.data.editItemForm;
	export let categories: { categoryName: string }[] = [];
	export let brands: { brandName: string }[] = [];
	export let locations: { locationName: string }[] = [];
	export let classifications: { classificationName: string }[] = [];
	export let equipment: Equipment;

	const form = superForm(theForm, {
		validators: zodClient(editItemSchema),
		resetForm: false,
		onUpdate(event) {
			if (!event.form.valid) {
				return;
			}
			toast.success("Item has been edited");
		}
	});

	const { form: formData, enhance, errors } = form;

	$: selectedCategory = $formData.category
		? {
				label: $formData.category,
				value: $formData.category
			}
		: equipment.category
			? {
					label: equipment.category,
					value: equipment.category
				}
			: undefined;

	$: selectedLocation = $formData.location
		? {
				label: $formData.location,
				value: $formData.location
			}
		: equipment.location
			? {
					label: equipment.location,
					value: equipment.location
				}
			: undefined;

	$: selectedAvailability = $formData.availability
		? {
				label: $formData.availability,
				value: $formData.availability
			}
		: equipment.availability
			? {
					label: equipment.availability,
					value: equipment.availability
				}
			: undefined;

	$: selectedConsumability = $formData.consumability
		? {
				label: $formData.consumability,
				value: $formData.consumability
			}
		: equipment.consumability
			? {
					label: equipment.consumability,
					value: equipment.consumability
				}
			: undefined;

	$: selectedBrand = $formData.brand
		? {
				label: $formData.brand,
				value: $formData.brand
			}
		: equipment.brand
			? {
					label: equipment.brand,
					value: equipment.brand
				}
			: undefined;

	$: selectedClassification = $formData.classification
		? {
				label: $formData.classification,
				value: $formData.classification
			}
		: equipment.classification
			? {
					label: equipment.classification,
					value: equipment.classification
				}
			: undefined;

	$: $formData.item = equipment.item;
	$: $formData.category = equipment.category;
	$: $formData.location = equipment.location;
	$: $formData.availability = equipment.availability;
	$: $formData.consumability = equipment.consumability;
	$: $formData.brand = equipment.brand || undefined;
	$: $formData.classification = equipment.classification || undefined;
	$: $formData.dateAcquired = equipment.dateAcquired
		? format(equipment.dateAcquired, "yyyy-MM-dd")
		: "0";
	$: $formData.acquisitionCost = equipment.acquisitionCost || "0";
	$: $formData.maintenanceInMonths = String(equipment.maintenanceInMonths) || "0";
	$: $formData.maintenanceCost = equipment.maintenanceCost || "0";
	$: $formData.expiryDate = equipment.expiryDate ? format(equipment.expiryDate, "yyyy-MM-dd") : "0";
	$: $formData.hasExpired = equipment.hasExpired;
	$: $formData.incoming = String(equipment.incoming) || "0";
	$: $formData.outgoing = String(equipment.outgoing) || "0";
	$: $formData.onHand = String(equipment.onHand) || "0";
	$: $formData.specification = equipment.specification || undefined;
	$: $formData.code = equipment.code || undefined;
	$: $formData.controlNumber = equipment.controlNumber || undefined;
	$: $formData.serialNumber = equipment.serialNumber || undefined;
</script>

<form
	action="?/editItem"
	method="POST"
	use:enhance
	class="grid grid-cols-12 gap-y-6 bg-white p-4 sm:gap-x-8"
>
	<h4 class="col-span-12 tracking-wider">PRIMARY DETAILS</h4>
	<Separator class="col-span-12" />
	<Form.Field {form} name="item" class="col-span-12 md:col-span-6 lg:col-span-4">
		<Form.Control let:attrs>
			<Form.Label>Item Name<span class="text-orange">*</span></Form.Label>
			<Input {...attrs} bind:value={$formData.item} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="category" class="col-span-12 md:col-span-6 lg:col-span-4">
		<Form.Control let:attrs>
			<Form.Label>Category<span class="text-orange">*</span></Form.Label>
			<Select.Root
				selected={selectedCategory}
				onSelectedChange={(v) => {
					v && ($formData.category = v.value);
				}}
			>
				<Select.Trigger {...attrs}>
					<Select.Value placeholder="Select" />
				</Select.Trigger>
				<Select.Content>
					{#each categories as category}
						<Select.Item value={category.categoryName} label={category.categoryName} />
					{/each}
				</Select.Content>
			</Select.Root>
			<input hidden bind:value={$formData.category} name={attrs.name} />
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="location" class="col-span-12 md:col-span-6 lg:col-span-4">
		<Form.Control let:attrs>
			<Form.Label>Location<span class="text-orange">*</span></Form.Label>
			<Select.Root
				selected={selectedLocation}
				onSelectedChange={(v) => {
					v && ($formData.location = v.value);
				}}
			>
				<Select.Trigger {...attrs}>
					<Select.Value placeholder="Select" />
				</Select.Trigger>
				<Select.Content>
					{#each locations as location}
						<Select.Item value={location.locationName} label={location.locationName} />
					{/each}
				</Select.Content>
			</Select.Root>
			<input hidden bind:value={$formData.location} name={attrs.name} />
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="availability" class="col-span-12 md:col-span-6 lg:col-span-4">
		<Form.Control let:attrs>
			<Form.Label>Availability<span class="text-orange">*</span></Form.Label>
			<Select.Root
				selected={selectedAvailability}
				onSelectedChange={(v) => {
					v && ($formData.availability = v.value);
				}}
			>
				<Select.Trigger {...attrs}>
					<Select.Value placeholder="Select" />
				</Select.Trigger>
				<Select.Content>
					{#each availabilities as availability}
						<Select.Item value={availability} label={availability} />
					{/each}
				</Select.Content>
			</Select.Root>
			<input hidden bind:value={$formData.availability} name={attrs.name} />
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="consumability" class="col-span-12 md:col-span-6 lg:col-span-4">
		<Form.Control let:attrs>
			<Form.Label>Consumability<span class="text-orange">*</span></Form.Label>
			<Select.Root
				selected={selectedConsumability}
				onSelectedChange={(v) => {
					v && ($formData.consumability = v.value);
				}}
			>
				<Select.Trigger {...attrs}>
					<Select.Value placeholder="Select" />
				</Select.Trigger>
				<Select.Content>
					{#each consumabilities as consumability}
						<Select.Item value={consumability} label={consumability} />
					{/each}
				</Select.Content>
			</Select.Root>
			<input hidden bind:value={$formData.consumability} name={attrs.name} />
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="brand" class="col-span-12 md:col-span-6 lg:col-span-4">
		<Form.Control let:attrs>
			<Form.Label>Brand</Form.Label>
			<Select.Root
				selected={selectedBrand}
				onSelectedChange={(v) => {
					v && ($formData.brand = v.value);
				}}
			>
				<Select.Trigger {...attrs}>
					<Select.Value placeholder="Select" />
				</Select.Trigger>
				<Select.Content>
					{#each brands as brand}
						<Select.Item value={brand.brandName} label={brand.brandName} />
					{/each}
				</Select.Content>
			</Select.Root>
			<input hidden bind:value={$formData.brand} name={attrs.name} />
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="classification" class="col-span-12 md:col-span-6 lg:col-span-4">
		<Form.Control let:attrs>
			<Form.Label>Classification</Form.Label>
			<Select.Root
				selected={selectedClassification}
				onSelectedChange={(v) => {
					v && ($formData.classification = v.value);
				}}
			>
				<Select.Trigger {...attrs}>
					<Select.Value placeholder="Select" />
				</Select.Trigger>
				<Select.Content>
					{#each classifications as classification}
						<Select.Item
							value={classification.classificationName}
							label={classification.classificationName}
						/>
					{/each}
				</Select.Content>
			</Select.Root>
			<input hidden bind:value={$formData.classification} name={attrs.name} />
		</Form.Control>

		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="dateAcquired" class="col-span-12 md:col-span-6 lg:col-span-4">
		<Form.Control let:attrs>
			<Form.Label>Date Acquired</Form.Label>
			<Input {...attrs} type="date" bind:value={$formData.dateAcquired} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="acquisitionCost" class="col-span-12 md:col-span-6 lg:col-span-4">
		<Form.Control let:attrs>
			<Form.Label>Acquisition Cost</Form.Label>
			<Input {...attrs} bind:value={$formData.acquisitionCost} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="maintenanceInMonths" class="col-span-12 md:col-span-6 lg:col-span-4">
		<Form.Control let:attrs>
			<Form.Label>Maintenance In Months</Form.Label>
			<Input {...attrs} type="number" bind:value={$formData.maintenanceInMonths} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="maintenanceCost" class="col-span-12 md:col-span-6 lg:col-span-4">
		<Form.Control let:attrs>
			<Form.Label>Maintenance Cost</Form.Label>
			<Input {...attrs} bind:value={$formData.maintenanceCost} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<div class="col-span-12 space-y-2">
		<Form.Field {form} name="expiryDate" class="max-w-xl">
			<Form.Control let:attrs>
				<Form.Label>Expiry Date</Form.Label>
				<Input
					disabled={$formData.hasExpired}
					{...attrs}
					type="date"
					bind:value={$formData.expiryDate}
				/>
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field
			{form}
			name="hasExpired"
			class="flex max-w-xl flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
		>
			<Form.Control let:attrs>
				<Checkbox {...attrs} bind:checked={$formData.hasExpired} />
				<div class="space-y-1 leading-none">
					<Form.Label>Not sure about the expiry date?</Form.Label>
					<Form.Description>You can tick this checkbox for special case</Form.Description>
				</div>
				<input name={attrs.name} value={$formData.hasExpired} hidden />
			</Form.Control>
		</Form.Field>
	</div>

	<Form.Field {form} name="incoming" class="col-span-6 lg:col-span-4 xl:col-span-2">
		<Form.Control let:attrs>
			<Form.Label>Incoming<span class="text-orange">*</span></Form.Label>
			<Input {...attrs} type="number" class="text-green-500" bind:value={$formData.incoming} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="outgoing" class="col-span-6 lg:col-span-4 xl:col-span-2">
		<Form.Control let:attrs>
			<Form.Label>Outgoing<span class="text-orange">*</span></Form.Label>
			<Input {...attrs} type="number" class="text-red-500" bind:value={$formData.outgoing} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="onHand" class="col-span-12 lg:col-span-4 xl:col-span-2">
		<Form.Control let:attrs>
			<Form.Label>Stocks On Hand<span class="text-orange">*</span></Form.Label>
			<Input {...attrs} type="number" bind:value={$formData.onHand} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<div class="col-span-6"></div>

	<Form.Field {form} name="specification" class="col-span-12">
		<Form.Control let:attrs>
			<Form.Label>Specification</Form.Label>
			<Textarea
				{...attrs}
				placeholder="max 300 characters"
				rows={6}
				class="max-w-xl resize-none"
				bind:value={$formData.specification}
			/>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<h4 class="col-span-12 tracking-wider">TRACKING DETAILS</h4>
	<Separator class="col-span-12" />

	<Form.Field {form} name="code" class="col-span-12 md:col-span-6 lg:col-span-4">
		<Form.Control let:attrs>
			<Form.Label>Item Code</Form.Label>
			<Input {...attrs} bind:value={$formData.code} class="" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="controlNumber" class="col-span-12 md:col-span-6 lg:col-span-4">
		<Form.Control let:attrs>
			<Form.Label>Control Number</Form.Label>
			<Input {...attrs} bind:value={$formData.controlNumber} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="serialNumber" class="col-span-12 md:col-span-6 lg:col-span-4">
		<Form.Control let:attrs>
			<Form.Label>Serial Number</Form.Label>
			<Input {...attrs} bind:value={$formData.serialNumber} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<div class="col-span-12">
		<Form.Errors errors={$errors._errors} />
	</div>

	<div class="col-span-12 grid grid-cols-2 gap-x-2 md:flex">
		<Button href="/admin/inventory" variant="outline">Back</Button>
		<Form.Button>Save</Form.Button>
	</div>
</form>
