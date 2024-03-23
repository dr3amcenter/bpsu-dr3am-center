<script lang="ts">
	import { MinusIcon } from "lucide-svelte";

	export let num = 0;
</script>

<div class="flex items-center gap-x-1 fill-red-500 text-lg text-red-500">
	<MinusIcon class="h-4 w-4" />
	{num}
</div>
