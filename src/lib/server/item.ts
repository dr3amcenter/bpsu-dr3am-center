import {
	addIncomingItemSchema,
	addOutgoingItemSchema,
	approveItemSchema,
	createItemSchema,
	declineItemSchema,
	editItemSchema,
	findItemSchema
} from "$lib/zod-schemas/item.schema";
import { fail, redirect, type RequestEvent } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms";
import { equipmentTable, transactionTable } from "./db/schema";
import { db } from "./db";
import { zod } from "sveltekit-superforms/adapters";
import { eq } from "drizzle-orm";

export async function findItemAction(event: RequestEvent) {
	if (!event.locals.user) redirect(302, "/login");

	const form = await superValidate(event, zod(findItemSchema));

	if (!form.valid) {
		return fail(400, {
			form
		});
	}

	const { itemId } = form.data;

	console.log(itemId);

	try {
		const item = await db.query.equipmentTable.findFirst({
			where: (equipment, { eq }) => eq(equipment.id, itemId)
		});

		if (!item) {
			return setError(form, "", "Item not found");
		}
	} catch {
		return setError(form, "", "Item not found");
	}

	return {
		form
	};
}

export async function editItemAction(event: RequestEvent) {
	if (!event.locals.user) redirect(302, "/login");

	const form = await superValidate(event, zod(editItemSchema));
	if (!form.valid) {
		return fail(400, {
			form
		});
	}

	const data = form.data;

	try {
		await db
			.update(equipmentTable)
			.set({
				item: data.item,
				location: data.location,
				category: data.category,
				incoming: Number(data.incoming),
				outgoing: Number(data.outgoing),
				onHand: Number(data.onHand),
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
				acquisitionCost: data.acquisitionCost,
				serialNumber: data.serialNumber,
				controlNumber: data.controlNumber,
				maintenanceCost: String(parseFloat(data.maintenanceCost)),
				maintenanceInMonths: parseFloat(data.maintenanceInMonths),
				updatedAt: new Date()
			})
			.where(eq(equipmentTable.id, event.params.id!));
	} catch (e) {
		return setError(form, "", "Unable to edit item");
	}

	return {
		form
	};
}

export async function createItemAction(event: RequestEvent) {
	if (!event.locals.user) redirect(302, "/login");

	const form = await superValidate(event, zod(createItemSchema));
	if (!form.valid) {
		return fail(400, {
			form
		});
	}

	const data = form.data;

	try {
		await db.insert(equipmentTable).values({
			item: data.item,
			location: data.location,
			category: data.category,
			incoming: Number(data.incoming),
			outgoing: Number(data.outgoing),
			onHand: Number(data.onHand),
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
			acquisitionCost: data.acquisitionCost,
			serialNumber: data.serialNumber,
			controlNumber: data.controlNumber,
			maintenanceCost: String(parseFloat(data.maintenanceCost)),
			maintenanceInMonths: parseFloat(data.maintenanceInMonths)
		});
	} catch (e) {
		return setError(form, "", "Unable to create new item");
	}

	return {
		form
	};
}

export async function addIncomingItemAction(event: RequestEvent) {
	if (!event.locals.user) redirect(302, "/login");

	const form = await superValidate(event, zod(addIncomingItemSchema));

	if (!form.valid) {
		return fail(400, {
			form
		});
	}

	const { id, quantity } = form.data;

	const quantityF = Number(quantity);

	try {
		const equipment = await db.query.equipmentTable.findFirst({
			where: (equipment, { eq }) => eq(equipment.id, id)
		});

		if (!equipment) {
			return setError(form, "", "Equipment not found");
		}

		const newOnHand = equipment.onHand + quantityF;
		const newIncoming = equipment.incoming + quantityF;

		await db.transaction(async (tx) => {
			await tx
				.update(equipmentTable)
				.set({
					onHand: newOnHand,
					incoming: newIncoming
				})
				.where(eq(equipmentTable.id, id))
				.execute();

			await tx.insert(transactionTable).values({
				equipmentId: id,
				quantity: quantityF,
				type: "incoming",
				status: "approved",
				requesterId: event.locals.user!.id,
				approverId: event.locals.user!.id
			});
		});
	} catch (e) {
		return setError(form, "", "Unable to add incoming");
	}

	return { form };
}

export async function addOutgoingItemAction(event: RequestEvent) {
	if (!event.locals.user) redirect(302, "/login");

	const form = await superValidate(event, zod(addOutgoingItemSchema));

	if (!form.valid) {
		return fail(400, {
			form
		});
	}

	const { id, quantity } = form.data;

	const quantityF = Number(quantity);

	try {
		const equipment = await db.query.equipmentTable.findFirst({
			where: (equipment, { eq }) => eq(equipment.id, id)
		});

		if (!equipment) {
			return setError(form, "", "Equipment not found");
		}

		const newOnHand = equipment.onHand - quantityF;
		const newOutgoing = equipment.outgoing + quantityF;

		if (newOnHand < 0) {
			return setError(form, "", "Not enough on hand");
		}

		await db.transaction(async (tx) => {
			await tx
				.update(equipmentTable)
				.set({
					onHand: newOnHand,
					outgoing: newOutgoing,
					updatedAt: new Date()
				})
				.where(eq(equipmentTable.id, id))
				.execute();

			await tx.insert(transactionTable).values({
				equipmentId: id,
				quantity: quantityF,
				type: "outgoing",
				status: "approved",
				requesterId: event.locals.user!.id,
				approverId: event.locals.user!.id
			});
		});
	} catch (e) {
		return setError(form, "", "Unable to add incoming");
	}

	return { form };
}

export async function approveItemAction(event: RequestEvent) {
	if (!event.locals.session) redirect(302, "/login");

	const form = await superValidate(event, zod(approveItemSchema));

	if (!form.valid) {
		return fail(400, {
			form
		});
	}

	const { transactionId } = form.data;

	const transaction = await db.query.transactionTable.findFirst({
		where: (transaction, { eq }) => eq(transaction.id, transactionId),
		with: {
			equipment: true
		}
	});

	if (!transaction) {
		return setError(form, "", "Request not found");
	}

	if (transaction.status === "approved") {
		return setError(form, "", "Request already approved");
	}

	if (transaction.status === "declined") {
		return setError(form, "", "Request already declined");
	}

	const newOnHand = transaction.equipment.onHand - transaction.quantity;
	const newOutgoing = transaction.equipment.outgoing + transaction.quantity;

	if (newOnHand < 0) {
		return setError(form, "", "Not enough on hand");
	}

	try {
		await db.transaction(async (tx) => {
			await tx
				.update(equipmentTable)
				.set({
					onHand: newOnHand,
					outgoing: newOutgoing,
					updatedAt: new Date()
				})
				.where(eq(equipmentTable.id, transaction.equipment.id))
				.execute();

			await tx
				.update(transactionTable)
				.set({ status: "approved", approverId: event.locals.user!.id, updatedAt: new Date() })
				.where(eq(transactionTable.id, transactionId))
				.execute();
		});
	} catch (error) {
		return setError(form, "", "Unable to approve request");
	}

	return {
		form
	};
}

export async function declineItemAction(event: RequestEvent) {
	if (!event.locals.session) redirect(302, "/login");

	const form = await superValidate(event, zod(declineItemSchema));

	if (!form.valid) {
		return fail(400, {
			form
		});
	}

	const { transactionId } = form.data;

	const transaction = await db.query.transactionTable.findFirst({
		where: (transaction, { eq }) => eq(transaction.id, transactionId),
		with: {
			equipment: true
		}
	});

	if (!transaction) {
		return setError(form, "", "Request not found");
	}

	if (transaction.status === "approved") {
		return setError(form, "", "Request already approved");
	}

	if (transaction.status === "declined") {
		return setError(form, "", "Request already declined");
	}

	try {
		await db
			.update(transactionTable)
			.set({ status: "declined", approverId: event.locals.user!.id, updatedAt: new Date() })
			.where(eq(transactionTable.id, transactionId))
			.execute();
	} catch (error) {
		return setError(form, "", "Unable to decline request");
	}

	return {
		form
	};
}
