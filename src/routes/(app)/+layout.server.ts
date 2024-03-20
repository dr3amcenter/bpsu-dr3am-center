import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
	await event.parent();

	if (!event.locals.user) {
		redirect(303, "/login");
	}

	return {
		user: event.locals.user
	};
};
