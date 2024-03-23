import { z } from "zod";

export const loginSchema = z.object({
	username: z.string().min(1, "Please enter a username"),
	password: z.string().min(1, "Please enter a password")
});

export type LoginSchema = typeof loginSchema;

export const newEquipmentSchema = z.object({
	item: z.string().min(1, "Item name is required"),
	location: z.string().min(1, "Location is required"),
	category: z.string().min(1, "Category is required"),
	incoming: z.number().refine((v) => Number(v) >= 0, { message: "Please enter a positive number" }),
	outgoing: z.number().refine((v) => Number(v) >= 0, { message: "Please enter a positive number" }),
	onHand: z.number().refine((v) => Number(v) >= 0, { message: "Please enter a positive number" }),
	availability: z.string().min(1, "Availability is required"),
	consumability: z.string().min(1, "Consumability is required"),
	hasExpired: z.boolean().default(false),
	acquisitionCost: z
		.number()
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
		.number()
		.refine((v) => Number(v) >= 0, { message: "Please enter a positive number" }),
	maintenanceCost: z
		.number()
		.refine((v) => Number(v) >= 0, { message: "Please enter a positive number" })
});

export type NewEquipmentSchema = typeof newEquipmentSchema;
