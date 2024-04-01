import type { LayoutServerLoad } from "./$types";

import { db } from "$lib/server/db";
import { error } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ params }) => {
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
		equipment
	};
};
