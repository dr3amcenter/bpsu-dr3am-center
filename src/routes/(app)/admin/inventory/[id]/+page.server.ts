import { db } from "$lib/server/db";
import { error } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import {
	addIncomingItemAction,
	addOutgoingItemAction,
	approveItemAction,
	declineItemAction
} from "$lib/server/item";
import { superValidate } from "sveltekit-superforms";
import { addIncomingItemSchema, addOutgoingItemSchema } from "$lib/zod-schemas/item.schema";
import { zod } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async ({ params }) => {
	const equipment = await db.query.equipmentTable.findFirst({
		where: (equipment, { eq }) => eq(equipment.id, params.id)
	});

	if (!equipment) {
		error(404, {
			message: "Not found"
		});
	}

	if (equipment.isDeleted) {
		error(404, {
			message: "Item has been deleted"
		});
	}

	return {
		equipment,
		transactions: await db.query.transactionTable.findMany({
			where: (transaction, { eq }) => eq(transaction.equipmentId, params.id),
			with: {
				approver: true,
				requester: true,
				equipment: true
			},
			orderBy: (transaction, { desc }) => desc(transaction.updatedAt)
		}),
		addIncomingItemForm: await superValidate(zod(addIncomingItemSchema)),
		addOutgoingItemForm: await superValidate(zod(addOutgoingItemSchema))
	};
};

export const actions: Actions = {
	addOutgingItem: addOutgoingItemAction,
	addIncomingItem: addIncomingItemAction,
	approveItem: approveItemAction,
	declineItem: declineItemAction
};
