import type { PageServerLoad, Actions } from "./$types";

import { db } from "$lib/server/db";
import { locationTable, equipmentTable } from "$lib/server/db/schema";
import { superValidate, setError } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { deleteLocationSchema, editLocationSchema, newLocationsSchema } from "./(data)/schema";
import { fail } from "@sveltejs/kit";
import postgres from "postgres";
import { desc, eq } from "drizzle-orm";

export const load: PageServerLoad = async () => {
	return {
		locations: await db.select().from(locationTable).orderBy(desc(locationTable.updatedAt)),
		newLocationsForm: await superValidate(zod(newLocationsSchema)),
		deleteLocationForm: await superValidate(zod(deleteLocationSchema)),
		editLocationForm: await superValidate(zod(editLocationSchema))
	};
};

export const actions: Actions = {
	newLocations: async (event) => {
		const form = await superValidate(event, zod(newLocationsSchema));

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
	},
	deleteLocation: async (event) => {
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
	},

	editLocation: async (event) => {
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
};
