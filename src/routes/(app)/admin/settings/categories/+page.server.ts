import type { PageServerLoad, Actions } from "./$types";

import { db } from "$lib/server/db";
import { categoryTable, equipmentTable } from "$lib/server/db/schema";
import { superValidate, setError } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { deleteCategorySchema, editCategorySchema, newCategoriesSchema } from "./(data)/schema";
import { fail } from "@sveltejs/kit";
import postgres from "postgres";
import { desc, eq } from "drizzle-orm";

export const load: PageServerLoad = async () => {
	return {
		categories: await db.select().from(categoryTable).orderBy(desc(categoryTable.updatedAt)),
		newCategoriesForm: await superValidate(zod(newCategoriesSchema)),
		deleteCategoryForm: await superValidate(zod(deleteCategorySchema)),
		editCategoryForm: await superValidate(zod(editCategorySchema))
	};
};

export const actions: Actions = {
	newCategories: async (event) => {
		const form = await superValidate(event, zod(newCategoriesSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const newCategories = form.data.categories.map((category) => ({
				categoryName: category.toUpperCase()
			}));

			await db.insert(categoryTable).values(newCategories).execute();
		} catch (e) {
			if (e instanceof postgres.PostgresError) {
				if (e.constraint_name === "category_pkey") {
					return setError(form, "", "Duplicate category detected");
				}
			}

			return setError(form, "", "Unable to create category");
		}

		return { form };
	},
	deleteCategory: async (event) => {
		const form = await superValidate(event, zod(deleteCategorySchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await db.transaction(async (tx) => {
				await tx
					.delete(categoryTable)
					.where(eq(categoryTable.categoryName, form.data.categoryName))
					.execute();

				if (form.data.cascade) {
					await tx
						.update(equipmentTable)
						.set({
							deletedAt: new Date(),
							updatedAt: new Date()
						})
						.where(eq(equipmentTable.category, form.data.categoryName))
						.execute();
				}
			});
		} catch (e) {
			return setError(form, "", "Unable to delete category");
		}

		return { form };
	},

	editCategory: async (event) => {
		const form = await superValidate(event, zod(editCategorySchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await db.transaction(async (tx) => {
				await tx
					.update(categoryTable)
					.set({
						categoryName: form.data.newName.toUpperCase()
					})
					.where(eq(categoryTable.categoryName, form.data.categoryName))
					.execute();

				if (form.data.cascade) {
					await tx
						.update(equipmentTable)
						.set({
							category: form.data.newName.toUpperCase(),
							updatedAt: new Date()
						})
						.where(eq(equipmentTable.category, form.data.categoryName))
						.execute();
				}
			});
		} catch (e) {
			if (e instanceof postgres.PostgresError) {
				if (e.constraint_name === "category_pkey") {
					return setError(form, "", "Duplicate category detected");
				}
			}

			return setError(form, "", "Unable to delete category");
		}

		return { form };
	}
};
