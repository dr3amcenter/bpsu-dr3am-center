<script lang="ts">
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Form from "$lib/components/ui/form";
	import { editAccountSchema, type EditAccountSchema } from "../(data)/schema";
	import { superForm, type SuperValidated, type Infer } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";
	import { buttonVariants } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { toast } from "svelte-sonner";

	import { page } from "$app/stores";
	import type { User } from "lucia";
	import { LoaderCircleIcon, SquarePenIcon } from "lucide-svelte";
	import Button from "$lib/components/ui/button/button.svelte";

	export let theForm: SuperValidated<Infer<EditAccountSchema>> = $page.data.editAccountForm;

	export let user: User;

	let open = false;

	const form = superForm(theForm, {
		validators: zodClient(editAccountSchema),
		id: `edit-form-${user.username}`,
		onUpdate(event) {
			if (!event.form.valid) {
				return;
			}
			toast.success("Account has been edited");
			open = false;
		}
	});

	const { form: formData, enhance, errors, submitting } = form;

	$: $formData.fullName = user.fullName;
	$: $formData.username = user.username;
	$: $formData.id = user.id;
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: "ghost", size: "icon" })}>
		<SquarePenIcon class="h-5 w-5" />
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Edit account {user.username}</Dialog.Title>
		</Dialog.Header>
		<form action="/admin/accounts/?/editAccount" method="POST" use:enhance class="space-y-4">
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

			<Form.Field {form} name="id" class="hidden">
				<Form.Control let:attrs>
					<Input {...attrs} bind:value={user.id} />
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
						Save
					{/if}
				</Form.Button>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
