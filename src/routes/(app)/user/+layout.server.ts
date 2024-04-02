import { superValidate } from "sveltekit-superforms";
import type { LayoutServerLoad } from "./$types";

import { zod } from "sveltekit-superforms/adapters";

import { createRequestItemSchema, deleteRequestItemSchema } from "$lib/zod-schemas/item.schema";

export const load: LayoutServerLoad = async () => {
	return {
		createRequestItemForm: await superValidate(zod(createRequestItemSchema)),
		deleteRequestItemForm: await superValidate(zod(deleteRequestItemSchema))
	};
};
