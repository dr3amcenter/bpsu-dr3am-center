import type { PageServerLoad, Actions } from "./$types";

import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import {
	deleteLocationSchema,
	editLocationSchema,
	createLocationsSchema
} from "$lib/zod-schemas/location.schema";

import {
	createLocationsAction,
	deleteLocationAction,
	editLocationAction,
	getLocations
} from "$lib/server/location";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "admin") redirect(302, "/user/inventory");

	return {
		locations: await getLocations(),
		createLocationsForm: await superValidate(zod(createLocationsSchema)),
		deleteLocationForm: await superValidate(zod(deleteLocationSchema)),
		editLocationForm: await superValidate(zod(editLocationSchema))
	};
};

export const actions: Actions = {
	createLocations: createLocationsAction,
	deleteLocation: deleteLocationAction,
	editLocation: editLocationAction
};
