<script lang="ts">
	import * as Form from "$lib/components/ui/form";
	import { Input } from "$lib/components/ui/input";
	import { loginSchema, type LoginSchema } from "$lib/zod-schemas";
	import { type SuperValidated, type Infer, superForm } from "sveltekit-superforms";
	import { zodClient } from "sveltekit-superforms/adapters";

	import Dr3amLogo from "$lib/assets/img/dr3am-logo.png";
	import Dr3amLogoBig from "$lib/assets/img/d3am-logo-big.png";

	export let data;

	const form = superForm(data.form, {
		validators: zodClient(loginSchema)
	});

	const { form: formData, enhance, errors } = form;
</script>

<main class="flex h-screen">
	<div class="col-span-2 flex h-full w-full flex-col px-4 py-8 md:px-16 lg:w-[550px]">
		<div class="mb-40 hidden items-center gap-x-6 lg:flex">
			<img src={Dr3amLogo} alt="DR3AM Center Logo" class="w-12" />
			<h1 class="text-3xl font-bold">BPSU DR3AM Center</h1>
		</div>
		<div class="flex justify-center lg:hidden">
			<img src={Dr3amLogoBig} alt="DR3AM Center Logo Big" class="mb-6 w-[300px]" />
		</div>
		<div class="space-y-6">
			<h2 class="text-2xl font-bold">Login.</h2>
			<form method="POST" use:enhance class="space-y-6">
				<Form.Field {form} name="username">
					<Form.Control let:attrs>
						<Form.Label>Enter your username</Form.Label>
						<Input {...attrs} bind:value={$formData.username} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="password">
					<Form.Control let:attrs>
						<Form.Label>Enter your password</Form.Label>
						<Input {...attrs} type="password" bind:value={$formData.password} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
				<Form.Errors errors={$errors._errors} />
				<Form.Button class="w-full">Submit</Form.Button>
			</form>
		</div>
	</div>
	<div class="hidden flex-1 bg-gray-500 lg:block"></div>
</main>
