import { z } from "zod";

export const loginSchema = z.object({
	username: z.string().min(1, "Please enter a username"),
	password: z.string().min(1, "Please enter a password")
});

export type LoginSchema = typeof loginSchema;
