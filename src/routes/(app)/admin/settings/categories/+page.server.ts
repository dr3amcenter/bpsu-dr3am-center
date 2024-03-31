import type { PageServerLoad, Actions } from "./$types";

import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import {
	deleteCategorySchema,
	editCategorySchema,
	createCategoriesSchema
} from "$lib/zod-schemas/category.schema";

import {
	createCategoriesAction,
	deleteCategoryAction,
	editCategoryAction,
	getCategories
} from "$lib/server/category";

export const load: PageServerLoad = async () => {
	return {
		categories: await getCategories(),
		createCategoriesForm: await superValidate(zod(createCategoriesSchema)),
		deleteCategoryForm: await superValidate(zod(deleteCategorySchema)),
		editCategoryForm: await superValidate(zod(editCategorySchema))
	};
};

export const actions: Actions = {
	createCategories: createCategoriesAction,
	deleteCategory: deleteCategoryAction,
	editCategory: editCategoryAction
};
