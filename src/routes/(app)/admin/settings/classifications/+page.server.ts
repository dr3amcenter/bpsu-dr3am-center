import type { PageServerLoad, Actions } from "./$types";

import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import {
	deleteClassificationSchema,
	editClassificationSchema,
	createClassificationsSchema
} from "$lib/zod-schemas/classification.schema";

import {
	createClassificationsAction,
	deleteClassificationAction,
	editClassificationAction,
	getClassifications
} from "$lib/server/classification";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "admin") redirect(302, "/user/inventory");

	return {
		classifications: await getClassifications(),
		newClassificationsForm: await superValidate(zod(createClassificationsSchema)),
		deleteClassificationForm: await superValidate(zod(deleteClassificationSchema)),
		editClassificationForm: await superValidate(zod(editClassificationSchema))
	};
};

export const actions: Actions = {
	createClassifications: createClassificationsAction,
	deleteClassification: deleteClassificationAction,
	editClassification: editClassificationAction
};
