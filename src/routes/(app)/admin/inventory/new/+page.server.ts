import { superValidate } from "sveltekit-superforms";
import type { PageServerLoad, Actions } from "./$types";

import { zod } from "sveltekit-superforms/adapters";
import { db } from "$lib/server/db";
import {
	brandTable,
	categoryTable,
	classificationTable,
	locationTable
} from "$lib/server/db/schema";
import { createItemAction } from "$lib/server/item";
import { createItemSchema } from "$lib/zod-schemas/item.schema";

export const load: PageServerLoad = async () => {
	return {
		createItemForm: await superValidate(zod(createItemSchema)),

		brands: await db.select().from(brandTable),
		categories: await db.select().from(categoryTable),
		locations: await db.select().from(locationTable),
		classifications: await db.select().from(classificationTable)
	};
};

export const actions: Actions = {
	createItem: createItemAction
};
