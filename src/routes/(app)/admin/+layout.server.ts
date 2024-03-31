import { superValidate } from "sveltekit-superforms";
import type { LayoutServerLoad } from "./$types";

import { zod } from "sveltekit-superforms/adapters";

import { approveItemSchema, declineItemSchema } from "$lib/zod-schemas/item.schema";

export const load: LayoutServerLoad = async () => {
	return {
		approveItemForm: await superValidate(zod(approveItemSchema)),
		declineItemForm: await superValidate(zod(declineItemSchema))
	};
};
