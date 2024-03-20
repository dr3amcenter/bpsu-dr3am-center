import { z } from "zod";

export const createAccountSchema = z.object({
	fullName: z.string().min(1, "Please enter your full name"),
	username: z.string().min(4, "Minimum of 4 characters").max(255, "Maximum of 255 characters"),
	password: z.string().min(8, "Minimum of 8 characters").max(255, "Maximum of 255 characters"),
	role: z.enum(["user", "admin"])
});

export type CreateAccountSchema = typeof createAccountSchema;

export const deleteAccountSchema = z.object({
	username: z.string().min(1, "Please enter a username")
});

export type DeleteAccountSchema = typeof deleteAccountSchema;

export const editAccountSchema = z.object({
	id: z.string().min(1, "Please enter an id"),
	fullName: z.string().min(1, "Please enter your full name"),
	username: z.string().min(4, "Minimum of 4 characters").max(255, "Maximum of 255 characters"),
	password: z
		.string()
		.min(8, "Minimum of 8 characters")
		.max(255, "Maximum of 255 characters")
		.optional()
});

export type EditAccountSchema = typeof editAccountSchema;

export const restoreAccountSchema = z.object({
	username: z.string().min(1, "Please enter a username")
});

export type RestoreAccountSchema = typeof restoreAccountSchema;
