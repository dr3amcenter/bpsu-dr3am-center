import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/db";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.session) redirect(302, "/login");

	const start = event.url.searchParams.get("startDate");
	const end = event.url.searchParams.get("endDate");

	const startDate = start ? new Date(start) : new Date(0);
	const endDate = end ? new Date(end) : new Date();

	return {
		transactions: await db.query.transactionTable.findMany({
			where: (transaction, { inArray, between, and }) =>
				and(
					inArray(transaction.status, ["approved", "declined"]),
					between(transaction.updatedAt, startDate, endDate)
				),
			with: {
				approver: true,
				requester: true,
				equipment: true
			},
			orderBy: (transaction, { desc }) => desc(transaction.updatedAt)
		})
	};
};
