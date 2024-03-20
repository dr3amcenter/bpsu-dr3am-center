<script lang="ts">
	export let errors: string[] | undefined;
</script>

<div class="text-destructive" aria-live="assertive">
	{#if errors && errors.length}
		{#each errors as err}
			<p>{err}</p>
		{/each}
	{/if}
</div>
