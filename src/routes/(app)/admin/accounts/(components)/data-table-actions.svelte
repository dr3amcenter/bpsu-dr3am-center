<script lang="ts">
	import { writable } from "svelte/store";
	import DeleteAccount from "./delete-account.svelte";
	import EditAccountDialog from "./edit-account-dialog.svelte";
	import RestoreAccount from "./restore-account.svelte";
	import type { User } from "lucia";

	export let user: User;
</script>

{#key user}
	{#if user.isDeleted}
		<div class="flex">
			<RestoreAccount username={user.username} />
		</div>
	{:else}
		<div class="flex">
			<DeleteAccount username={user.username} />
			<EditAccountDialog {user} />
		</div>
	{/if}
{/key}
