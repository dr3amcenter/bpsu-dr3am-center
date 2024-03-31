<script lang="ts">
	import RequestApproveForm from "./request-approve-form.svelte";
	import RequestDeclineForm from "./request-decline-form.svelte";

	export let id: string;
</script>

<div class="flex items-center justify-center space-x-2">
	<RequestDeclineForm transactionId={id} />
	<RequestApproveForm transactionId={id} />
</div>
