import type { PageServerLoad } from "./$types";

import { db } from "$lib/server/db";

export const load: PageServerLoad = async () => {
	return {
		admins: await db.query.userTable
			.findMany({
				where: (user, { and, eq }) => and(eq(user.role, "admin"), eq(user.isDeleted, false)),
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
