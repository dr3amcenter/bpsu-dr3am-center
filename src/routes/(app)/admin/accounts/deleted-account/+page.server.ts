import type { PageServerLoad } from "./$types";

import { db } from "$lib/server/db";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.session) redirect(302, "/login");

	return {
		deletedAccounts: await db.query.userTable
			.findMany({
				where: (user, { eq }) => eq(user.isDeleted, true),
				columns: {
					username: true,
					fullName: true,
					createdAt: true,
					id: true,
					role: true,
					isDeleted: true
				},
				orderBy: (user, { desc }) => desc(user.createdAt)
			})
			.execute()
	};
};
