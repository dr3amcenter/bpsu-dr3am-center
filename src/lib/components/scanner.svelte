<script lang="ts">
	import QrScanner from "qr-scanner";
	import { onMount, tick } from "svelte";
	import { toast } from "svelte-sonner";

	import * as Form from "$lib/components/ui/form";
	import Input from "$lib/components/ui/input/input.svelte";

	import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { findItemSchema } from "$lib/zod-schemas/item.schema";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { getUserState } from "$lib/store";

	const user = getUserState();

	let scannedResult: string;
	let videoFeed: HTMLVideoElement;
	let submitBtn: HTMLButtonElement;

	export let theForm: SuperValidated<Infer<typeof findItemSchema>> = $page.data.findItemForm;

	const form = superForm(theForm, {
		validators: zodClient(findItemSchema),
		id: `find-item-form`,
		resetForm: false,
		onUpdate(event) {
			if (!event.form.valid) {
				if (event.form.errors._errors) {
					toast.error(event.form.errors._errors[0], {
						position: "bottom-center"
					});
				}
				return;
			}

			toast("ITEM FOUND", {
				action: {
					label: "View",
					onClick: () => {
						goto(`/${$user.role}/inventory/${event.form.data.itemId}`);
					}
				},
				position: "bottom-center",
				duration: 10000,
				description: `Click "view" for details`
			});
		}
	});

	const { form: formData, enhance, submitting } = form;

	async function submitForm(result: string) {
		$formData.itemId = result;
		await tick();
		submitBtn.click();
	}

	onMount(() => {
		const scanner = new QrScanner(
			videoFeed,
			async (result: { data: string }) => {
				scannedResult = result.data;
			},
			{
				/* your options or returnDetailedScanResult: true if you're not specifying any other options */
				highlightScanRegion: true
				// overlay: scannerOverlay
			}
		);

		scanner.start();

		return () => {
			scanner.destroy();
		};
	});

	$: {
		if (scannedResult) {
			submitForm(scannedResult);
		}
	}
</script>

<div class="flex h-screen w-full flex-col p-0">
	<!-- svelte-ignore a11y-media-has-caption -->
	<video bind:this={videoFeed} class="flex-1" />

	<form method="POST" action="/?/findItem" use:enhance>
		<Form.Field {form} name="itemId">
			<Form.Control let:attrs>
				<Input {...attrs} type="hidden" bind:value={$formData.itemId} />
			</Form.Control>
		</Form.Field>

		<button type="submit" bind:this={submitBtn} class="hidden" />
	</form>
</div>
