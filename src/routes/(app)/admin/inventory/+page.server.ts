import { db } from "$lib/server/db";
import { equipmentTable } from "$lib/server/db/schema";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	return {
		equipments: await db.select().from(equipmentTable)
	};
};
