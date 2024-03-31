import { db } from "$lib/server/db";
import { equipmentTable } from "$lib/server/db/schema";
import type { Actions, PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { addIncomingItemAction, addOutgoingItemAction } from "$lib/server/item";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { addIncomingItemSchema, addOutgoingItemSchema } from "$lib/zod-schemas/item.schema";
import { eq } from "drizzle-orm";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.session) redirect(302, "/login");

	return {
		equipments: await db.select().from(equipmentTable).where(eq(equipmentTable.isDeleted, false)),
		addIncomingItemForm: await superValidate(zod(addIncomingItemSchema)),
		addOutgoingItemForm: await superValidate(zod(addOutgoingItemSchema))
	};
};

export const actions: Actions = {
	addIncomingItem: addIncomingItemAction,
	addOutgoingItem: addOutgoingItemAction
};
