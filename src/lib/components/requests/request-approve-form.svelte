<script lang="ts">
	import * as Form from "$lib/components/ui/form";
	import { approveItemSchema } from "$lib/zod-schemas/item.schema";
	import { superForm, type SuperValidated, type Infer } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { Input } from "$lib/components/ui/input";
	import { toast } from "svelte-sonner";
	import { CheckIcon, LoaderCircleIcon } from "lucide-svelte";

	import { page } from "$app/stores";

	export let theForm: SuperValidated<Infer<typeof approveItemSchema>> = $page.data.approveItemForm;

	export let transactionId: string;

	let open = false;

	const form = superForm(theForm, {
		validators: zodClient(approveItemSchema),
		id: `approve-form-${transactionId}`,
		resetForm: false,
		onUpdate(event) {
			if (!event.form.valid) {
				if (event.form.errors._errors) {
					toast.error(event.form.errors._errors[0]);
				}
				return;
			}
			toast.success("Request Approved");
			open = false;
		}
	});

	const { form: formData, enhance, submitting } = form;

	$: $formData.transactionId = transactionId;
</script>

<form action="?/approveItem" method="POST" use:enhance>
	<Form.Field {form} name="transactionId">
		<Form.Control let:attrs>
			<Input {...attrs} type="hidden" bind:value={$formData.transactionId} />
		</Form.Control>
	</Form.Field>
	<Form.Button variant="ghost" size="icon" disabled={$submitting}>
		{#if $submitting}
			<LoaderCircleIcon class="h-5 w-5 animate-spin" />
		{:else}
			<CheckIcon class="h-5 w-5 text-green-500" />
		{/if}
	</Form.Button>
</form>
