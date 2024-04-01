import { superValidate } from "sveltekit-superforms";
import type { Actions, PageServerLoad } from "./$types";
import { zod } from "sveltekit-superforms/adapters";
import { editItemSchema } from "$lib/zod-schemas/item.schema";
import { db } from "$lib/server/db";
import {
	brandTable,
	categoryTable,
	locationTable,
	classificationTable
} from "$lib/server/db/schema";
import { editItemAction } from "$lib/server/item";

export const load: PageServerLoad = async ({ parent }) => {
	await parent();

	return {
		editItemForm: await superValidate(zod(editItemSchema)),
		brands: await db.select().from(brandTable),
		categories: await db.select().from(categoryTable),
		locations: await db.select().from(locationTable),
		classifications: await db.select().from(classificationTable)
	};
};

export const actions: Actions = {
	editItem: editItemAction
};
