import { type RequestEvent, fail } from "@sveltejs/kit";
import {
	deleteClassificationSchema,
	editClassificationSchema,
	createClassificationsSchema
} from "$lib/zod-schemas/classification.schema";
import { zod } from "sveltekit-superforms/adapters";
import { superValidate, setError } from "sveltekit-superforms";
import postgres from "postgres";

import { db } from "./db";
import { classificationTable, equipmentTable } from "./db/schema";
import { eq, desc } from "drizzle-orm";

export async function getClassifications() {
	return await db.select().from(classificationTable).orderBy(desc(classificationTable.updatedAt));
}

export async function createClassificationsAction(event: RequestEvent) {
	const form = await superValidate(event, zod(createClassificationsSchema));

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
}

export async function deleteClassificationAction(event: RequestEvent) {
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
}

export async function editClassificationAction(event: RequestEvent) {
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
