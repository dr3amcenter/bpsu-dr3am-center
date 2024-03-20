import type { PageServerLoad } from "./$types";

import { db } from "$lib/server/db";

export const load: PageServerLoad = async () => {
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
