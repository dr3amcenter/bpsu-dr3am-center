import { setError, superValidate } from "sveltekit-superforms";
import type { PageServerLoad, Actions } from "./$types";
import { newEquipmentSchema } from "$lib/zod-schemas";

import { zod } from "sveltekit-superforms/adapters";
import { fail } from "@sveltejs/kit";
import postgres from "postgres";
import { db } from "$lib/server/db";
import {
	brandTable,
	categoryTable,
	classificationTable,
	equipmentTable,
	locationTable
} from "$lib/server/db/schema";

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(newEquipmentSchema)),
		brands: await db.select().from(brandTable),
		categories: await db.select().from(categoryTable),
		locations: await db.select().from(locationTable),
		classifications: await db.select().from(classificationTable)
	};
};

export const actions: Actions = {
	newEquipment: async (event) => {
		const form = await superValidate(event, zod(newEquipmentSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const data = form.data;

		try {
			console.log(data);

			await db.insert(equipmentTable).values({
				item: data.item,
				location: data.location,
				category: data.category,
				incoming: data.incoming,
				outgoing: data.outgoing,
				onHand: data.onHand,
				availability: data.availability,
				consumability: data.consumability,
				//OPTIONALS
				code: data.code,
				classification: data.classification,
				expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
				specification: data.specification,
				hasExpired: data.hasExpired,
				brand: data.brand,
				dateAcquired: data.dateAcquired ? new Date(data.dateAcquired) : null,
				acquisitionCost: String(data.acquisitionCost),
				serialNumber: data.serialNumber,
				controlNumber: data.controlNumber,
				maintenanceCost: String(data.maintenanceCost),
				maintenanceInMonths: data.maintenanceInMonths
			});
		} catch (e) {
			// check for unique constraint error in user table
			if (e instanceof postgres.PostgresError) {
				if (e.constraint_name === "auth_user_username_unique") {
					return setError(form, "", "Username already taken");
				}
			}

			return setError(form, "", "Unable to create account");
		}

		return {
			form
		};
	}
};
