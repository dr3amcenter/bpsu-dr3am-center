import { redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { db } from "$lib/server/db";
import { deleteRequestItemAction } from "$lib/server/item";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, "/login");

	return {
		transactions: await db.query.transactionTable.findMany({
			where: (transaction, { eq, and }) =>
				and(eq(transaction.status, "pending"), eq(transaction.requesterId, event.locals.user!.id)),
			with: {
				approver: true,
				requester: true,
				equipment: true
			},
			orderBy: (transaction, { desc }) => desc(transaction.updatedAt)
		})
	};
};

export const actions: Actions = {
	deleteRequestItem: deleteRequestItemAction
};
