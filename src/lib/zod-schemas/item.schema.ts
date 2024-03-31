import { z } from "zod";

export const createItemSchema = z.object({
	item: z.string().min(1, "Item name is required"),
	location: z.string().min(1, "Location is required"),
	category: z.string().min(1, "Category is required"),
	incoming: z
		.string()
		.default("0")
		.refine((v) => Number(v) >= 0, { message: "Please enter a positive number" }),
	outgoing: z
		.string()
		.default("0")
		.refine((v) => Number(v) >= 0, { message: "Please enter a positive number" }),
	onHand: z
		.string()
		.default("0")
		.refine((v) => Number(v) >= 0, { message: "Please enter a positive number" }),
	availability: z.string().min(1, "Availability is required"),
	consumability: z.string().min(1, "Consumability is required"),
	hasExpired: z.boolean().default(false),
	acquisitionCost: z
		.string()
		.default("0")
		.refine((v) => Number(v) >= 0, { message: "Please enter a positive number" }),
	brand: z.string().optional(),
	classification: z.string().optional(),
	code: z.string().optional(),
	expiryDate: z.string().optional(),
	dateAcquired: z.string().optional(),
	specification: z.string().optional(),
	serialNumber: z.string().optional(),
	controlNumber: z.string().optional(),
	maintenanceInMonths: z
		.string()
		.default("0")
		.refine((v) => Number(v) >= 0, { message: "Please enter a positive number" }),
	maintenanceCost: z
		.string()
		.default("0")
		.refine((v) => Number(v) >= 0, { message: "Please enter a positive number" })
});

export const approveItemSchema = z.object({
	transactionId: z.string().min(1, "Please enter an id")
});

export const declineItemSchema = z.object({
	transactionId: z.string().min(1, "Please enter an id")
});

export const addIncomingItemSchema = z.object({
	id: z.string().min(1, "Please enter an id"),
	quantity: z
		.string()
		.default("0")
		.refine((v) => Number(v) > 0, { message: "Please enter a positive number" })
});

export const addOutgoingItemSchema = z.object({
	id: z.string().min(1, "Please enter an id"),
	quantity: z
		.string()
		.default("0")
		.refine((v) => Number(v) > 0, { message: "Please enter a positive number" })
});

export const findItemSchema = z.object({
	itemId: z.string().min(1, "Please provide an id")
});
