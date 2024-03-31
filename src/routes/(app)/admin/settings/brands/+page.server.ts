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

export const load: PageServerLoad = async () => {
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
