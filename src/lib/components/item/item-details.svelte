<script lang="ts">
	import type { Equipment } from "$lib/server/db/schema";

	import Separator from "$lib/components/ui/separator/separator.svelte";
	import Outgoing from "$lib/components/outgoing.svelte";
	import Incoming from "$lib/components/incoming.svelte";
	import OnHand from "$lib/components/onHand.svelte";
	import QrCode from "$lib/components/qr-code.svelte";

	import { getFrequency } from "$lib/utils";
	import { format } from "date-fns";
	import Button from "../ui/button/button.svelte";
	import ItemDeleteDialog from "./item-delete-dialog.svelte";

	export let equipment: Equipment;

	const emptyIndicator = "--------------------------";
</script>

<div class="grid grid-cols-10 gap-x-4 gap-y-6 py-4 text-sm text-gray-400">
	<h4 class="col-span-10 tracking-widest">PRIMARY DETAILS</h4>

	<div class="col-span-4 text-gray-400 lg:col-span-2">Location</div>
	<div class="col-span-6 text-gray-800 lg:col-span-3">{equipment.location}</div>

	<div class="col-span-4 text-gray-400 lg:col-span-2">Availability</div>
	<div class="col-span-6 text-gray-800 lg:col-span-3">{equipment.availability}</div>

	<div class="col-span-4 text-gray-400 lg:col-span-2">Category</div>
	<div class="col-span-6 text-gray-800 lg:col-span-3">{equipment.category}</div>

	<div class="col-span-4 text-gray-400 lg:col-span-2">Consumability</div>
	<div class="col-span-6 text-gray-800 lg:col-span-3">{equipment.consumability}</div>

	<div class="col-span-4 text-gray-400 lg:col-span-2">Brand</div>
	<div class="col-span-6 text-gray-800 lg:col-span-3">{equipment.brand || emptyIndicator}</div>

	<div class="col-span-4 text-gray-400 lg:col-span-2">Classification</div>
	<div class="col-span-6 text-gray-800 lg:col-span-3">
		{equipment.classification || emptyIndicator}
	</div>

	<div class="col-span-4 text-gray-400 lg:col-span-2">Expiry Date</div>
	<div class="col-span-6 text-gray-800 lg:col-span-3">
		{equipment.expiryDate ? format(equipment.expiryDate, "MM-dd-yyyy") : emptyIndicator}
	</div>

	<div class="col-span-4 text-gray-400 lg:col-span-2">Specification</div>
	<div class="col-span-6 text-gray-800 lg:col-span-3">
		{equipment.specification || emptyIndicator}
	</div>

	<Separator class="col-span-10" />

	<div class="col-span-10 grid grid-cols-5 gap-x-4 gap-y-6 lg:col-span-5">
		<h4 class="col-span-5 tracking-widest">PURCHASE DETAILS</h4>

		<div class="col-span-2 text-gray-400">Date Acquired</div>
		<div class="col-span-3 text-gray-800">
			{equipment.dateAcquired ? format(equipment.dateAcquired, "MM-dd-yyyy") : emptyIndicator}
		</div>

		<div class="col-span-2 text-gray-400">Cost</div>
		<div class="col-span-3 text-gray-800">₱ {equipment.acquisitionCost}</div>
	</div>

	<div class="col-span-10 grid grid-cols-5 gap-x-4 gap-y-6 lg:col-span-5">
		<h4 class="col-span-5 tracking-widest">MAINTENANCE DETAILS</h4>

		<div class="col-span-2 text-gray-400">Maintenance</div>
		<div class="col-span-3 text-gray-800">
			{equipment.maintenanceInMonths ? getFrequency(equipment.maintenanceInMonths) : emptyIndicator}
		</div>

		<div class="col-span-2 text-gray-400">Cost</div>
		<div class="col-span-3 text-gray-800">₱ {equipment.maintenanceCost}</div>
	</div>

	<Separator class="col-span-10" />

	<div class="col-span-10 grid grid-cols-5 gap-x-4 gap-y-6 lg:col-span-5">
		<h4 class="col-span-5 tracking-widest">STOCK DETAILS</h4>

		<div class="col-span-2 text-gray-400">Incoming</div>
		<div class="col-span-3 text-gray-800"><Incoming num={equipment.incoming} /></div>

		<div class="col-span-2 text-gray-400">Outgoing</div>
		<div class="col-span-3 text-gray-800"><Outgoing num={equipment.outgoing} /></div>

		<div class="col-span-2 text-gray-400">On Hand</div>
		<div class="col-span-3 text-gray-800"><OnHand num={equipment.onHand} /></div>
	</div>

	<div class="col-span-10 grid grid-cols-5 gap-x-4 gap-y-6 lg:col-span-5">
		<h4 class="col-span-5 tracking-widest">TRACKING DETAILS</h4>

		<div class="col-span-2 text-gray-400">Item Code</div>
		<div class="col-span-3 text-gray-800">{equipment.code || emptyIndicator}</div>

		<div class="col-span-2 text-gray-400">Control Number</div>
		<div class="col-span-3 text-gray-800">{equipment.controlNumber || emptyIndicator}</div>

		<div class="col-span-2 text-gray-400">Serial Number</div>
		<div class="col-span-3 text-gray-800">{equipment.serialNumber || emptyIndicator}</div>
	</div>

	<Separator class="col-span-10" />

	<div class="col-span-10 space-y-4">
		<h4 class="col-span-5 tracking-widest">ITEM QR CODE</h4>
		<QrCode value={equipment.id} title={equipment.item} />
	</div>

	<div class="col-span-10 flex space-y-4">
		<div class="ml-auto">
			<ItemDeleteDialog equipmentId={equipment.id} equipmentName={equipment.item} />
		</div>
	</div>
</div>
