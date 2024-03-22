<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Form from "$lib/components/ui/form";
	import { Button } from "$lib/components/ui/button";
	import { createAccountSchema, type CreateAccountSchema } from "../(data)/schema";
	import { superForm, type SuperValidated, type Infer } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { buttonVariants } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { toast } from "svelte-sonner";
	import { LoaderCircleIcon } from "lucide-svelte";

	import { page } from "$app/stores";

	export let theForm: SuperValidated<Infer<CreateAccountSchema>> = $page.data.createAccountForm;

	export let role: "user" | "admin";

	let open = false;

	const form = superForm(theForm, {
		validators: zodClient(createAccountSchema),
		onUpdate(event) {
			if (!event.form.valid) {
				return;
			}
			toast.success("New account has been created");
			open = false;
		}
	});

	const { form: formData, enhance, errors, submitting } = form;
	$: $formData.role = role;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants()}>Add {role}</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Create a new {role}</Dialog.Title>
		</Dialog.Header>
		<form action="/admin/accounts/?/createAccount" method="POST" use:enhance class="space-y-4">
			<Form.Field {form} name="fullName">
				<Form.Control let:attrs>
					<Form.Label>Full Name</Form.Label>
					<Input {...attrs} bind:value={$formData.fullName} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="username">
				<Form.Control let:attrs>
					<Form.Label>Username</Form.Label>
					<Input {...attrs} bind:value={$formData.username} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<Form.Label>Password</Form.Label>
					<Input {...attrs} type="password" bind:value={$formData.password} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Field {form} name="role" class="hidden">
				<Form.Control let:attrs>
					<Input {...attrs} bind:value={role} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<Form.Errors errors={$errors._errors} />
			<div class="grid grid-cols-2 gap-x-2">
				<Button disabled={$submitting} variant="outline" on:click={() => (open = false)}
					>Cancel</Button
				>
				<Form.Button disabled={$submitting}>
					{#if $submitting}
						<LoaderCircleIcon class="h-5 w-5 animate-spin" />
					{:else}
						Add {role}
					{/if}
				</Form.Button>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
