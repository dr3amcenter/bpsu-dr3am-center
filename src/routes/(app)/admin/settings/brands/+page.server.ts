import type { PageServerLoad, Actions } from "./$types";

import { db } from "$lib/server/db";
import { brandTable, equipmentTable } from "$lib/server/db/schema";
import { superValidate, setError } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { deleteBrandSchema, editBrandSchema, newBrandsSchema } from "./(data)/schema";
import { fail } from "@sveltejs/kit";
import postgres from "postgres";
import { desc, eq } from "drizzle-orm";

export const load: PageServerLoad = async () => {
	return {
		brands: await db.select().from(brandTable).orderBy(desc(brandTable.updatedAt)),
		newBrandsForm: await superValidate(zod(newBrandsSchema)),
		deleteBrandForm: await superValidate(zod(deleteBrandSchema)),
		editBrandForm: await superValidate(zod(editBrandSchema))
	};
};

export const actions: Actions = {
	newBrands: async (event) => {
		const form = await superValidate(event, zod(newBrandsSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const newBrands = form.data.brands.map((brand) => ({
				brandName: brand.toUpperCase()
			}));

			await db.insert(brandTable).values(newBrands).execute();
		} catch (e) {
			if (e instanceof postgres.PostgresError) {
				if (e.constraint_name === "brand_pkey") {
					return setError(form, "", "Duplicate brand detected");
				}
			}

			return setError(form, "", "Unable to create brand");
		}

		return { form };
	},
	deleteBrand: async (event) => {
		const form = await superValidate(event, zod(deleteBrandSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await db.transaction(async (tx) => {
				await tx.delete(brandTable).where(eq(brandTable.brandName, form.data.brandName)).execute();

				if (form.data.cascade) {
					await tx
						.update(equipmentTable)
						.set({
							deletedAt: new Date(),
							updatedAt: new Date()
						})
						.where(eq(equipmentTable.brand, form.data.brandName))
						.execute();
				}
			});
		} catch (e) {
			return setError(form, "", "Unable to delete brand");
		}

		return { form };
	},

	editBrand: async (event) => {
		const form = await superValidate(event, zod(editBrandSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await db.transaction(async (tx) => {
				await tx
					.update(brandTable)
					.set({
						brandName: form.data.newName.toUpperCase()
					})
					.where(eq(brandTable.brandName, form.data.brandName))
					.execute();

				if (form.data.cascade) {
					await tx
						.update(equipmentTable)
						.set({
							brand: form.data.newName.toUpperCase(),
							updatedAt: new Date()
						})
						.where(eq(equipmentTable.brand, form.data.brandName))
						.execute();
				}
			});
		} catch (e) {
			if (e instanceof postgres.PostgresError) {
				if (e.constraint_name === "brand_pkey") {
					return setError(form, "", "Duplicate brand detected");
				}
			}

			return setError(form, "", "Unable to delete brand");
		}

		return { form };
	}
};
