import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.session) redirect(302, "/login");

	return {
		transactions: await db.query.transactionTable.findMany({
			where: (transaction, { inArray }) => inArray(transaction.status, ["approved", "declined"]),
			with: {
				approver: true,
				requester: true,
				equipment: true
			},
			orderBy: (transaction, { desc }) => desc(transaction.updatedAt)
		})
	};
};
