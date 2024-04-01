import { db } from "$lib/server/db";
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

export const load: PageServerLoad = async ({ params, parent }) => {
	await parent();

	return {
		transactions: await db.query.transactionTable.findMany({
			where: (transaction, { eq }) => eq(transaction.equipmentId, params.id),
			with: {
				approver: true,
				requester: true,
				equipment: true
			},
			orderBy: (transaction, { asc }) => asc(transaction.updatedAt)
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
