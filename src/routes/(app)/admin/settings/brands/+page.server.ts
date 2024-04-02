import type { PageServerLoad, Actions } from "./$types";

import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import {
	deleteBrandSchema,
	editBrandSchema,
	createBrandsSchema
} from "$lib/zod-schemas/brand.schema";

import {
	createBrandsAction,
	deleteBrandAction,
	editBrandAction,
	getBrands
} from "$lib/server/brand";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "admin") redirect(302, "/user/inventory");

	return {
		brands: await getBrands(),
		createBrandsForm: await superValidate(zod(createBrandsSchema)),
		deleteBrandForm: await superValidate(zod(deleteBrandSchema)),
		editBrandForm: await superValidate(zod(editBrandSchema))
	};
};

export const actions: Actions = {
	createBrands: createBrandsAction,
	deleteBrand: deleteBrandAction,
	editBrand: editBrandAction
};
