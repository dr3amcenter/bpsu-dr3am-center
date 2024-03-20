<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Form from "$lib/components/ui/form";
	import { restoreAccountSchema, type RestoreAccountSchema } from "../(data)/schema";
	import { superForm, type SuperValidated, type Infer } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { buttonVariants } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { toast } from "svelte-sonner";
	import { LoaderCircleIcon, RefreshCcwIcon } from "lucide-svelte";
	import Button from "$lib/components/ui/button/button.svelte";

	import { page } from "$app/stores";

	export let theForm: SuperValidated<Infer<RestoreAccountSchema>> = $page.data.restoreAccountForm;

	export let username: string;

	let open = false;

	const form = superForm(theForm, {
		validators: zodClient(restoreAccountSchema),
		id: `restore-form-${username}`,
		onUpdate(event) {
			if (!event.form.valid) {
				return;
			}
			toast.success("Account has been restored");
			open = false;
		}
	});

	const { form: formData, enhance, submitting } = form;

	$: $formData.username = username;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: "ghost", size: "icon" })}>
		<RefreshCcwIcon class="h-5 w-5" />
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Restore Account "{username}"?</Dialog.Title>
		</Dialog.Header>
		<form action="/admin/accounts/?/restoreAccount" method="POST" use:enhance class="space-y-4">
			<Form.Field {form} name="username" class="hidden">
				<Form.Control let:attrs>
					<Input {...attrs} bind:value={username} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div class="grid grid-cols-2 gap-x-2">
				<Button disabled={$submitting} variant="outline">Cancel</Button>
				<Form.Button disabled={$submitting}>
					{#if $submitting}
						<LoaderCircleIcon class="h-5 w-5 animate-spin" />
					{:else}
						Restore
					{/if}
				</Form.Button>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
