import { redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { db } from "$lib/server/db";
import { approveItemAction, declineItemAction } from "$lib/server/item";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "admin") redirect(302, "/user/inventory");

	return {
		transactions: await db.query.transactionTable.findMany({
			where: (transaction, { eq }) => eq(transaction.status, "pending"),
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
	approveItem: approveItemAction,
	declineItem: declineItemAction
};
