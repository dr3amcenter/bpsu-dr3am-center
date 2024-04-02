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
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "admin") redirect(302, "/user/inventory");

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
