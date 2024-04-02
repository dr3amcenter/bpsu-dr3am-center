import type { PageServerLoad, Actions } from "./$types";

import { db } from "$lib/server/db";
import { error, redirect } from "@sveltejs/kit";
import { createRequestItemAction, deleteRequestItemAction } from "$lib/server/item";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, "/login");

	const { params } = event;

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
			where: (transaction, { eq, and }) =>
				and(
					eq(transaction.equipmentId, params.id),
					eq(transaction.requesterId, event.locals.user!.id)
				),
			with: {
				approver: true,
				requester: true,
				equipment: true
			},
			orderBy: (transaction, { asc }) => asc(transaction.updatedAt)
		})
	};
};

export const actions: Actions = {
	deleteRequestItem: deleteRequestItemAction,
	createRequestItem: createRequestItemAction
};
