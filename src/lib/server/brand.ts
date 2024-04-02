import { type RequestEvent, fail, redirect } from "@sveltejs/kit";
import {
	deleteBrandSchema,
	editBrandSchema,
	createBrandsSchema
} from "$lib/zod-schemas/brand.schema";
import { zod } from "sveltekit-superforms/adapters";
import { superValidate, setError } from "sveltekit-superforms";
import postgres from "postgres";

import { db } from "./db";
import { brandTable, equipmentTable } from "./db/schema";
import { eq, desc } from "drizzle-orm";

export async function getBrands() {
	return await db.select().from(brandTable).orderBy(desc(brandTable.updatedAt));
}

export async function createBrandsAction(event: RequestEvent) {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "admin") redirect(302, "/user/inventory");

	const form = await superValidate(event, zod(createBrandsSchema));

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
}

export async function deleteBrandAction(event: RequestEvent) {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "admin") redirect(302, "/user/inventory");

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
}

export async function editBrandAction(event: RequestEvent) {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "admin") redirect(302, "/user/inventory");

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
