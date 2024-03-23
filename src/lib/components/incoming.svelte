<script lang="ts">
	import { PlusIcon } from "lucide-svelte";

	export let num = 0;
</script>

<div class="flex items-center gap-x-1 fill-green-500 text-lg text-green-500">
	<PlusIcon class="h-4 w-4" />
	{num}
</div>
