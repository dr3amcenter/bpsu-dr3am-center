<script lang="ts">
	import { getUserState } from "$lib/store";
	import RequestApproveForm from "./request-approve-form.svelte";
	import RequestDeclineForm from "./request-decline-form.svelte";
	import RequestDeleteForm from "./request-delete-form.svelte";

	const user = getUserState();

	export let id: string;
</script>

<div class="flex items-center justify-center space-x-2">
	{#if $user.role === "admin"}
		<RequestDeclineForm transactionId={id} />
		<RequestApproveForm transactionId={id} />
	{:else}
		<RequestDeleteForm transactionId={id} />
	{/if}
</div>
