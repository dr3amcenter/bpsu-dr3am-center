<script lang="ts">
	import type { DateRange } from "bits-ui";
	import {
		CalendarDate,
		DateFormatter,
		getLocalTimeZone,
		type DateValue
	} from "@internationalized/date";
	import { cn } from "$lib/utils.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { RangeCalendar } from "$lib/components/ui/range-calendar/index.js";
	import * as Popover from "$lib/components/ui/popover/index.js";
	import { CalendarIcon } from "lucide-svelte";

	const df = new DateFormatter("en-US", {
		dateStyle: "medium"
	});

	export let value: DateRange | undefined;

	let startValue: DateValue | undefined = undefined;
</script>

<div class="grid gap-2">
	<Popover.Root openFocus>
		<Popover.Trigger asChild let:builder>
			<Button
				variant="outline"
				class={cn(
					"w-full justify-start text-left font-normal sm:w-[300px]",
					!value && "text-muted-foreground"
				)}
				builders={[builder]}
			>
				<CalendarIcon class="mr-2 h-4 w-4" />
				{#if value && value.start}
					{#if value.end}
						{df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
							value.end.toDate(getLocalTimeZone())
						)}
					{:else}
						{df.format(value.start.toDate(getLocalTimeZone()))}
					{/if}
				{:else if startValue}
					{df.format(startValue.toDate(getLocalTimeZone()))}
				{:else}
					Pick a date
				{/if}
			</Button>
		</Popover.Trigger>
		<Popover.Content class="w-auto p-0" align="start">
			<RangeCalendar
				bind:value
				bind:startValue
				placeholder={value?.start}
				initialFocus
				numberOfMonths={2}
			/>
		</Popover.Content>
	</Popover.Root>
</div>
