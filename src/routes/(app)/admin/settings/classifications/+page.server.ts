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

export const load: PageServerLoad = async () => {
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
