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
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "admin") redirect(302, "/user/inventory");

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
