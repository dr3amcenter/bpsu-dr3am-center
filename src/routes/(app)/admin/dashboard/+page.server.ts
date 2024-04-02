import { redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
import { db } from "$lib/server/db";
import { approveItemAction, declineItemAction } from "$lib/server/item";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "admin") redirect(302, "/user/inventory");

	return {
		outgoingRequests: await db.query.transactionTable.findMany({
			where: (transaction, { eq }) => eq(transaction.status, "pending"),
			with: {
				approver: true,
				requester: true,
				equipment: true
			},
			orderBy: (transaction, { desc }) => desc(transaction.updatedAt),
			limit: 3
		}),
		items: await db.query.equipmentTable.findMany({
			where: (equipment, { eq }) => eq(equipment.isDeleted, false),
			with: {
				transactions: {
					columns: {
						status: true
					}
				}
			}
		}),
		transactions: await db.query.transactionTable.findMany({
			where: (transaction, { inArray }) => inArray(transaction.status, ["approved", "declined"]),
			with: {
				approver: true,
				requester: true,
				equipment: true
			},
			orderBy: (transaction, { desc }) => desc(transaction.updatedAt),
			limit: 3
		})
	};
};

export const actions: Actions = {
	approveItem: approveItemAction,
	declineItem: declineItemAction
};
