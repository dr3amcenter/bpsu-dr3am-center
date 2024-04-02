import { type RequestEvent, fail, redirect } from "@sveltejs/kit";
import {
	deleteCategorySchema,
	editCategorySchema,
	createCategoriesSchema
} from "$lib/zod-schemas/category.schema";
import { zod } from "sveltekit-superforms/adapters";
import { superValidate, setError } from "sveltekit-superforms";
import postgres from "postgres";

import { db } from "./db";
import { categoryTable, equipmentTable } from "./db/schema";
import { eq, desc } from "drizzle-orm";

export async function getCategories() {
	return await db.select().from(categoryTable).orderBy(desc(categoryTable.updatedAt));
}

export async function createCategoriesAction(event: RequestEvent) {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "admin") redirect(302, "/user/inventory");

	const form = await superValidate(event, zod(createCategoriesSchema));

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
}

export async function deleteCategoryAction(event: RequestEvent) {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "admin") redirect(302, "/user/inventory");

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
}

export async function editCategoryAction(event: RequestEvent) {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "admin") redirect(302, "/user/inventory");

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
