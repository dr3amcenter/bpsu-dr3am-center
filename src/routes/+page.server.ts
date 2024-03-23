import type { PageServerLoad } from "./$types";

import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		if (event.locals.user.role === "admin") {
			redirect(302, "/admin/dashboard");
		}

		if (event.locals.user.role === "user") {
			redirect(302, "/user/inventory");
		}
	}

	redirect(302, "/login");
};
