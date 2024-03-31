import { findItemSchema } from "$lib/zod-schemas/item.schema";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
	return {
		user: event.locals.user,
		findItemForm: await superValidate(zod(findItemSchema))
	};
};
