<script lang="ts">
	import { buttonVariants } from "$lib/components/ui/button";
	import Button from "$lib/components/ui/button/button.svelte";

	import * as Dialog from "$lib/components/ui/dialog";

	import { cn } from "$lib/utils";
	import { SlidersHorizontalIcon } from "lucide-svelte";

	import * as Select from "$lib/components/ui/select";
	import { Label } from "$lib/components/ui/label";

	import { availabilities, consumabilities } from "$lib/config";
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { Input } from "$lib/components/ui/input";
	import { Checkbox } from "$lib/components/ui/checkbox/index.js";

	import { format } from "date-fns";

	export let categories: string[] = [];
	export let brands: string[] = [];
	export let locations: string[] = [];
	export let classifications: string[] = [];
	let open = false;
	let expand = false;

	let availabilitiesParams = $page.url.searchParams.get("availabilities");
	let consumabilitiesParams = $page.url.searchParams.get("consumabilities");
	let categoriesParams = $page.url.searchParams.get("categories");
	let locationsParams = $page.url.searchParams.get("locations");
	let brandsParams = $page.url.searchParams.get("brands");
	let classificationsParams = $page.url.searchParams.get("classifications");

	let acquiredDateStart = $page.url.searchParams.get("acquiredDateStart")
		? format($page.url.searchParams.get("acquiredDateStart")!, "yyyy-MM-dd")
		: undefined;
	let acquiredDateEnd = $page.url.searchParams.get("acquiredDateEnd")
		? format($page.url.searchParams.get("acquiredDateEnd")!, "yyyy-MM-dd")
		: undefined;

	let acquisitionCostStart = $page.url.searchParams.get("acquisitionCostStart");
	let acquisitionCostEnd = $page.url.searchParams.get("acquisitionCostEnd");

	let maintenanceCostStart = $page.url.searchParams.get("maintenanceCostStart");
	let maintenanceCostEnd = $page.url.searchParams.get("maintenanceCostEnd");

	let onHandStart = $page.url.searchParams.get("onHandStart");
	let onHandEnd = $page.url.searchParams.get("onHandEnd");

	let incomingStart = $page.url.searchParams.get("incomingStart");
	let incomingEnd = $page.url.searchParams.get("incomingEnd");

	let outgoingStart = $page.url.searchParams.get("outgoingStart");
	let outgoingEnd = $page.url.searchParams.get("outgoingEnd");

	let maintenanceInMonthsStart = $page.url.searchParams.get("maintenanceInMonthsStart")
		? format($page.url.searchParams.get("maintenanceInMonthsStart")!, "yyyy-MM-dd")
		: undefined;

	let maintenanceInMonthsEnd = $page.url.searchParams.get("maintenanceInMonthsEnd")
		? format($page.url.searchParams.get("maintenanceInMonthsEnd")!, "yyyy-MM-dd")
		: undefined;

	let hasExpired = Boolean($page.url.searchParams.get("hasExpired"));

	let hasExpiredin30D = Boolean($page.url.searchParams.get("hasExpiredin30D"));

	let hasExpiredin6M = Boolean($page.url.searchParams.get("hasExpiredin6M"));

	$: selectedAvailabilities = availabilitiesParams
		? availabilitiesParams.split(",").map((v) => ({ label: v, value: v }))
		: undefined;

	$: selectedConsumabilities = consumabilitiesParams
		? consumabilitiesParams.split(",").map((v) => ({ label: v, value: v }))
		: undefined;

	$: selectedCategories = categoriesParams
		? categoriesParams.split(",").map((v) => ({ label: v, value: v }))
		: undefined;

	$: selectedLocations = locationsParams
		? locationsParams.split(",").map((v) => ({ label: v, value: v }))
		: undefined;

	$: selectedBrands = brandsParams
		? brandsParams.split(",").map((v) => ({ label: v, value: v }))
		: undefined;

	$: selectedClassifications = classificationsParams
		? classificationsParams.split(",").map((v) => ({ label: v, value: v }))
		: undefined;

	function applyFilter() {
		const url = $page.url.pathname;
		const params = new URLSearchParams();

		if (selectedAvailabilities && selectedAvailabilities.length > 0) {
			params.append("availabilities", selectedAvailabilities.map((v) => v.value).join(","));
		}

		if (selectedConsumabilities && selectedConsumabilities.length > 0) {
			params.append("consumabilities", selectedConsumabilities.map((v) => v.value).join(","));
		}

		if (selectedCategories && selectedCategories.length > 0) {
			params.append("categories", selectedCategories.map((v) => v.value).join(","));
		}

		if (selectedLocations && selectedLocations.length > 0) {
			params.append("locations", selectedLocations.map((v) => v.value).join(","));
		}

		if (selectedBrands && selectedBrands.length > 0) {
			params.append("brands", selectedBrands.map((v) => v.value).join(","));
		}

		if (selectedClassifications && selectedClassifications.length > 0) {
			params.append("classifications", selectedClassifications.map((v) => v.value).join(","));
		}

		if (acquiredDateStart) {
			params.append("acquiredDateStart", format(new Date(acquiredDateStart), "MM-dd-yyyy"));
		}

		if (acquiredDateEnd) {
			params.append("acquiredDateEnd", format(new Date(acquiredDateEnd), "MM-dd-yyyy"));
		}

		if (acquisitionCostStart) {
			params.append("acquisitionCostStart", acquisitionCostStart);
		}

		if (acquisitionCostEnd) {
			params.append("acquisitionCostEnd", acquisitionCostEnd);
		}

		if (maintenanceCostStart) {
			params.append("maintenanceCostStart", maintenanceCostStart);
		}

		if (maintenanceCostEnd) {
			params.append("maintenanceCostEnd", maintenanceCostEnd);
		}

		if (onHandStart) {
			params.append("onHandStart", onHandStart);
		}

		if (onHandEnd) {
			params.append("onHandEnd", onHandEnd);
		}

		if (incomingStart) {
			params.append("incomingStart", incomingStart);
		}

		if (incomingEnd) {
			params.append("incomingEnd", incomingEnd);
		}

		if (outgoingStart) {
			params.append("outgoingStart", outgoingStart);
		}

		if (outgoingEnd) {
			params.append("outgoingEnd", outgoingEnd);
		}

		if (maintenanceInMonthsStart) {
			params.append("maintenanceInMonthsStart", maintenanceInMonthsStart);
		}

		if (maintenanceInMonthsEnd) {
			params.append("maintenanceInMonthsEnd", maintenanceInMonthsEnd);
		}
		if (hasExpired) {
			params.append("hasExpired", String(hasExpired));
		}
		if (hasExpiredin30D) {
			params.append("hasExpiredin30D", String(hasExpiredin30D));
		}
		if (hasExpiredin6M) {
			params.append("hasExpiredin6M", String(hasExpiredin6M));
		}

		goto(`${url}?${params}`, { replaceState: true });
		open = false;
	}

	async function clearFilter() {
		goto(`${$page.url.pathname}`, { replaceState: true });
	}

	function toggleExpand() {
		expand = !expand;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={cn(buttonVariants({ variant: "ghost", size: "icon" }))}>
		<SlidersHorizontalIcon class="h-4 w-4" />
	</Dialog.Trigger>

	<Dialog.Content class="max-h-[90vh] max-w-2xl overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title>Advanced Filter</Dialog.Title>
		</Dialog.Header>

		<div class="grid grid-cols-2 gap-4">
			<div class="col-span-2 space-y-2 sm:col-span-1">
				<Label for="availability">Availability</Label>
				<Select.Root
					multiple
					selected={selectedAvailabilities}
					onSelectedChange={(values) => {
						if (values) {
							selectedAvailabilities = values.map(({ value }) => ({
								label: value,
								value
							}));
						}
					}}
				>
					<Select.Trigger id="availability">
						<Select.Value placeholder="Select Availability" />
					</Select.Trigger>
					<Select.Content>
						{#each availabilities as availability}
							<Select.Item value={availability} label={availability} />
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<div class="col-span-2 space-y-2 sm:col-span-1">
				<Label for="consumability">Consumability</Label>
				<Select.Root
					multiple
					selected={selectedConsumabilities}
					onSelectedChange={(values) => {
						if (values) {
							selectedConsumabilities = values.map(({ value }) => ({
								label: value,
								value
							}));
						}
					}}
				>
					<Select.Trigger id="consumability">
						<Select.Value placeholder="Select Consumability" />
					</Select.Trigger>
					<Select.Content>
						{#each consumabilities as consumability}
							<Select.Item value={consumability} label={consumability} />
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<div class="col-span-2 space-y-2 sm:col-span-1">
				<Label for="category">Category</Label>
				<Select.Root
					multiple
					selected={selectedCategories}
					onSelectedChange={(values) => {
						if (values) {
							selectedCategories = values.map(({ value }) => ({
								label: value,
								value
							}));
						}
					}}
				>
					<Select.Trigger id="category">
						<Select.Value placeholder="Select Category" />
					</Select.Trigger>
					<Select.Content>
						{#each categories as category}
							<Select.Item value={category} label={category} />
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<div class="col-span-2 space-y-2 sm:col-span-1">
				<Label for="location">Location</Label>
				<Select.Root
					multiple
					selected={selectedLocations}
					onSelectedChange={(values) => {
						if (values) {
							selectedLocations = values.map(({ value }) => ({
								label: value,
								value
							}));
						}
					}}
				>
					<Select.Trigger id="location">
						<Select.Value placeholder="Select Location" />
					</Select.Trigger>
					<Select.Content>
						{#each locations as location}
							<Select.Item value={location} label={location} />
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<div class="col-span-2 space-y-2 sm:col-span-1">
				<Label for="brand">Brand</Label>
				<Select.Root
					multiple
					selected={selectedBrands}
					onSelectedChange={(values) => {
						if (values) {
							selectedBrands = values.map(({ value }) => ({
								label: value,
								value
							}));
						}
					}}
				>
					<Select.Trigger id="brand">
						<Select.Value placeholder="Select Brand" />
					</Select.Trigger>
					<Select.Content>
						{#each brands as brand}
							<Select.Item value={brand} label={brand} />
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<div class="col-span-2 space-y-2 sm:col-span-1">
				<Label for="classification">Classification</Label>
				<Select.Root
					multiple
					selected={selectedClassifications}
					onSelectedChange={(values) => {
						if (values) {
							selectedClassifications = values.map(({ value }) => ({
								label: value,
								value
							}));
						}
					}}
				>
					<Select.Trigger id="classification">
						<Select.Value placeholder="Select Classification" />
					</Select.Trigger>
					<Select.Content>
						{#each classifications as classification}
							<Select.Item value={classification} label={classification} />
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			{#if expand}
				<div class="grid-y-1 col-span-2">
					<div class="text-sm font-medium leading-none">Date Acquired</div>
					<div class="grid grid-cols-2 gap-x-4">
						<div class="space-y-2">
							<Label for="acquiredDateStart">Start</Label>
							<Input type="date" id="acquiredDateStart" bind:value={acquiredDateStart} />
						</div>

						<div class="space-y-2">
							<Label for="acquiredDateEnd">End</Label>
							<Input type="date" id="acquiredDateEnd" bind:value={acquiredDateEnd} />
						</div>
					</div>
				</div>

				<div class="grid-y-1 col-span-2">
					<div class="text-sm font-medium leading-none">Acquisition Cost</div>
					<div class="grid grid-cols-2 gap-x-4">
						<div class="space-y-2">
							<Label for="acquisitionCostStart">Start</Label>
							<Input id="acquisitionCostStart" bind:value={acquisitionCostStart} />
						</div>

						<div class="space-y-2">
							<Label for="acquisitionCostEnd">End</Label>
							<Input id="acquisitionCostEnd" bind:value={acquisitionCostEnd} />
						</div>
					</div>
				</div>

				<div class="grid-y-1 col-span-2">
					<div class="text-sm font-medium leading-none">Maintenance Cost</div>
					<div class="grid grid-cols-2 gap-x-4">
						<div class="space-y-2">
							<Label for="maintenanceCostStart">Start</Label>
							<Input id="maintenanceCostStart" bind:value={maintenanceCostStart} />
						</div>

						<div class="space-y-2">
							<Label for="maintenanceCostEnd">End</Label>
							<Input id="maintenanceCostEnd" bind:value={maintenanceCostEnd} />
						</div>
					</div>
				</div>

				<div class="grid-y-1 col-span-2">
					<div class="text-sm font-medium leading-none">On Hand</div>
					<div class="grid grid-cols-2 gap-x-4">
						<div class="space-y-2">
							<Label for="onHandStart">Start</Label>
							<Input id="onHandStart" bind:value={onHandStart} />
						</div>

						<div class="space-y-2">
							<Label for="onHandEnd">End</Label>
							<Input id="onHandEnd" bind:value={onHandEnd} />
						</div>
					</div>
				</div>

				<div class="grid-y-1 col-span-2">
					<div class="text-sm font-medium leading-none">Incoming</div>
					<div class="grid grid-cols-2 gap-x-4">
						<div class="space-y-2">
							<Label for="incomingStart">Start</Label>
							<Input id="incomingStart" bind:value={incomingStart} />
						</div>

						<div class="space-y-2">
							<Label for="incomingEnd">End</Label>
							<Input id="incomingEnd" bind:value={incomingEnd} />
						</div>
					</div>
				</div>

				<div class="grid-y-1 col-span-2">
					<div class="text-sm font-medium leading-none">Outgoing</div>
					<div class="grid grid-cols-2 gap-x-4">
						<div class="space-y-2">
							<Label for="outgoingStart">Start</Label>
							<Input id="outgoingStart" bind:value={outgoingStart} />
						</div>

						<div class="space-y-2">
							<Label for="outgoingEnd">End</Label>
							<Input id="outgoingEnd" bind:value={outgoingEnd} />
						</div>
					</div>
				</div>

				<div class="grid-y-1 col-span-2">
					<div class="text-sm font-medium leading-none">Maintenance In Months</div>
					<div class="grid grid-cols-2 gap-x-4">
						<div class="space-y-2">
							<Label for="maintenanceInMonthsStart">Start</Label>
							<Input id="maintenanceInMonthsStart" bind:value={maintenanceInMonthsStart} />
						</div>

						<div class="space-y-2">
							<Label for="maintenanceInMonthsEnd">End</Label>
							<Input id="maintenanceInMonthsEnd" bind:value={maintenanceInMonthsEnd} />
						</div>
					</div>
				</div>

				<div class="col-span-2 space-y-2 rounded-md border p-4">
					<div class="flex flex-row items-start space-x-3">
						<Checkbox id="hasExpired" bind:checked={hasExpired} />
						<div class="space-y-1 leading-none">
							<Label for="hasExpired">Expired Item</Label>
						</div>
					</div>
					<div class="flex flex-row items-start space-x-3">
						<Checkbox id="hasExpiredin30D" bind:checked={hasExpiredin30D} />
						<div class="space-y-1 leading-none">
							<Label for="hasExpiredin30D">Expired Item within 30 Days</Label>
						</div>
					</div>
					<div class="flex flex-row items-start space-x-3">
						<Checkbox id="hasExpiredin6M" bind:checked={hasExpiredin6M} />
						<div class="space-y-1 leading-none">
							<Label for="hasExpiredin6M">Expired Item within 6 months</Label>
						</div>
					</div>
				</div>
			{:else}
				<Button
					variant="outline"
					class="col-span-2 border-primary text-primary"
					on:click={toggleExpand}>Show more</Button
				>
			{/if}
		</div>

		<Dialog.Footer>
			<div class="flex justify-end gap-x-2">
				<Button size="sm" variant="outline" on:click={clearFilter}>Clear</Button>
				<Button size="sm" on:click={applyFilter}>Apply Filter</Button>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
