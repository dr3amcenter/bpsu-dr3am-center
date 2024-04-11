import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, "/login");

	const qrValues = event.params.qrValue.split("/");

	const lastValue = qrValues[qrValues.length - 1];

	if (lastValue) {
		redirect(302, `/${event.locals.user.role}/inventory/${lastValue}`);
	}
};
