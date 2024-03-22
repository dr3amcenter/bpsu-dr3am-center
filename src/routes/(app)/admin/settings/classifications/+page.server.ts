import type { PageServerLoad, Actions } from "./$types";

import { db } from "$lib/server/db";
import { classificationTable, equipmentTable } from "$lib/server/db/schema";
import { superValidate, setError } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import {
	deleteClassificationSchema,
	editClassificationSchema,
	newClassificationsSchema
} from "./(data)/schema";
import { fail } from "@sveltejs/kit";
import postgres from "postgres";
import { desc, eq } from "drizzle-orm";

export const load: PageServerLoad = async () => {
	return {
		classifications: await db
			.select()
			.from(classificationTable)
			.orderBy(desc(classificationTable.updatedAt)),
		newClassificationsForm: await superValidate(zod(newClassificationsSchema)),
		deleteClassificationForm: await superValidate(zod(deleteClassificationSchema)),
		editClassificationForm: await superValidate(zod(editClassificationSchema))
	};
};

export const actions: Actions = {
	newClassifications: async (event) => {
		const form = await superValidate(event, zod(newClassificationsSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const newClassifications = form.data.classifications.map((classification) => ({
				classificationName: classification.toUpperCase()
			}));

			await db.insert(classificationTable).values(newClassifications).execute();
		} catch (e) {
			if (e instanceof postgres.PostgresError) {
				if (e.constraint_name === "classification_pkey") {
					return setError(form, "", "Duplicate classification detected");
				}
			}

			return setError(form, "", "Unable to create classification");
		}

		return { form };
	},
	deleteClassification: async (event) => {
		const form = await superValidate(event, zod(deleteClassificationSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await db.transaction(async (tx) => {
				await tx
					.delete(classificationTable)
					.where(eq(classificationTable.classificationName, form.data.classificationName))
					.execute();

				if (form.data.cascade) {
					await tx
						.update(equipmentTable)
						.set({
							deletedAt: new Date(),
							updatedAt: new Date()
						})
						.where(eq(equipmentTable.classification, form.data.classificationName))
						.execute();
				}
			});
		} catch (e) {
			return setError(form, "", "Unable to delete classification");
		}

		return { form };
	},

	editClassification: async (event) => {
		const form = await superValidate(event, zod(editClassificationSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await db.transaction(async (tx) => {
				await tx
					.update(classificationTable)
					.set({
						classificationName: form.data.newName.toUpperCase()
					})
					.where(eq(classificationTable.classificationName, form.data.classificationName))
					.execute();

				if (form.data.cascade) {
					await tx
						.update(equipmentTable)
						.set({
							classification: form.data.newName.toUpperCase(),
							updatedAt: new Date()
						})
						.where(eq(equipmentTable.classification, form.data.classificationName))
						.execute();
				}
			});
		} catch (e) {
			if (e instanceof postgres.PostgresError) {
				if (e.constraint_name === "classification_pkey") {
					return setError(form, "", "Duplicate classification detected");
				}
			}

			return setError(form, "", "Unable to delete classification");
		}

		return { form };
	}
};
