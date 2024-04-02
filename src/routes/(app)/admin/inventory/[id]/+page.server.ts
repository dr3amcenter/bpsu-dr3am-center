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
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "admin") redirect(302, "/user/inventory");

	const { parent, params } = event;

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
