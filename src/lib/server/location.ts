import { type RequestEvent, fail, redirect } from "@sveltejs/kit";
import {
	deleteLocationSchema,
	editLocationSchema,
	createLocationsSchema
} from "$lib/zod-schemas/location.schema";
import { zod } from "sveltekit-superforms/adapters";
import { superValidate, setError } from "sveltekit-superforms";
import postgres from "postgres";

import { db } from "./db";
import { locationTable, equipmentTable } from "./db/schema";
import { eq, desc } from "drizzle-orm";

export async function getLocations() {
	return await db.select().from(locationTable).orderBy(desc(locationTable.updatedAt));
}

export async function createLocationsAction(event: RequestEvent) {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "admin") redirect(302, "/user/inventory");

	const form = await superValidate(event, zod(createLocationsSchema));

	if (!form.valid) {
		return fail(400, {
			form
		});
	}

	try {
		const newLocations = form.data.locations.map((location) => ({
			locationName: location.toUpperCase()
		}));

		await db.insert(locationTable).values(newLocations).execute();
	} catch (e) {
		if (e instanceof postgres.PostgresError) {
			if (e.constraint_name === "location_pkey") {
				return setError(form, "", "Duplicate location detected");
			}
		}

		return setError(form, "", "Unable to create location");
	}

	return { form };
}

export async function deleteLocationAction(event: RequestEvent) {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "admin") redirect(302, "/user/inventory");

	const form = await superValidate(event, zod(deleteLocationSchema));

	if (!form.valid) {
		return fail(400, {
			form
		});
	}

	try {
		await db.transaction(async (tx) => {
			await tx
				.delete(locationTable)
				.where(eq(locationTable.locationName, form.data.locationName))
				.execute();

			if (form.data.cascade) {
				await tx
					.update(equipmentTable)
					.set({
						deletedAt: new Date(),
						updatedAt: new Date()
					})
					.where(eq(equipmentTable.location, form.data.locationName))
					.execute();
			}
		});
	} catch (e) {
		return setError(form, "", "Unable to delete location");
	}

	return { form };
}

export async function editLocationAction(event: RequestEvent) {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "admin") redirect(302, "/user/inventory");

	const form = await superValidate(event, zod(editLocationSchema));

	if (!form.valid) {
		return fail(400, {
			form
		});
	}

	try {
		await db.transaction(async (tx) => {
			await tx
				.update(locationTable)
				.set({
					locationName: form.data.newName.toUpperCase()
				})
				.where(eq(locationTable.locationName, form.data.locationName))
				.execute();

			if (form.data.cascade) {
				await tx
					.update(equipmentTable)
					.set({
						location: form.data.newName.toUpperCase(),
						updatedAt: new Date()
					})
					.where(eq(equipmentTable.location, form.data.locationName))
					.execute();
			}
		});
	} catch (e) {
		if (e instanceof postgres.PostgresError) {
			if (e.constraint_name === "location_pkey") {
				return setError(form, "", "Duplicate location detected");
			}
		}

		return setError(form, "", "Unable to delete location");
	}

	return { form };
}
