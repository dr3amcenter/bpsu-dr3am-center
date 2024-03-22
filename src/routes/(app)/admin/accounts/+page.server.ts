import { setError, superValidate } from "sveltekit-superforms";
import type { Actions } from "./$types";
import {
	createAccountSchema,
	deleteAccountSchema,
	editAccountSchema,
	restoreAccountSchema
} from "./(data)/schema";

import { zod } from "sveltekit-superforms/adapters";
import { fail } from "@sveltejs/kit";
import { generateId } from "lucia";
import { Argon2id } from "oslo/password";
import { db } from "$lib/server/db";
import { sessionTable, userTable } from "$lib/server/db/schema";
import postgres from "postgres";
import { eq } from "drizzle-orm";

export const actions: Actions = {
	createAccount: async (event) => {
		const form = await superValidate(event, zod(createAccountSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { username, password, fullName, role } = form.data;
		const userId = generateId(15);
		const hashedPassword = await new Argon2id().hash(password);

		try {
			await db
				.insert(userTable)
				.values({
					id: userId,
					username,
					hashed_password: hashedPassword,
					fullName,
					role: role
				})
				.execute();
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
	},
	editAccount: async (event) => {
		const form = await superValidate(event, zod(editAccountSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { username, password, fullName, id } = form.data;

		try {
			const user = await db.query.userTable.findFirst({
				where: (user, { eq }) => eq(user.id, id)
			});

			if (!user) {
				return setError(form, "", "Account not found");
			}

			await db.transaction(async (tx) => {
				if (user.fullName !== fullName) {
					await tx
						.update(userTable)
						.set({ fullName, updatedAt: new Date() })
						.where(eq(userTable.id, id))
						.execute();
				}

				if (password) {
					const hashedPassword = await new Argon2id().hash(password);
					await db
						.update(userTable)
						.set({
							username,
							hashed_password: hashedPassword,
							fullName,
							updatedAt: new Date()
						})
						.where(eq(userTable.id, id))
						.execute();
				}

				if (user.username !== username) {
					await tx.update(userTable).set({ username }).where(eq(userTable.id, id)).execute();
				}
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
	},
	deleteAccount: async (event) => {
		const form = await superValidate(event, zod(deleteAccountSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { username } = form.data;

		try {
			const user = await db.query.userTable.findFirst({
				where: (user, { eq }) => eq(user.username, username)
			});

			if (!user) {
				return setError(form, "", "Account not found");
			}

			await db.transaction(async (tx) => {
				await tx
					.update(userTable)
					.set({ isDeleted: true, updatedAt: new Date() })
					.where(eq(userTable.id, user.id))
					.execute();

				await tx.delete(sessionTable).where(eq(sessionTable.userId, user.id)).execute();
			});
		} catch (e) {
			return setError(form, "", "Unable to delete account");
		}

		return {
			form
		};
	},
	restoreAccount: async (event) => {
		const form = await superValidate(event, zod(restoreAccountSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { username } = form.data;

		try {
			const user = await db.query.userTable.findFirst({
				where: (user, { eq }) => eq(user.username, username)
			});

			if (!user) {
				return setError(form, "", "Account not found");
			}

			await db
				.update(userTable)
				.set({ isDeleted: false, updatedAt: new Date() })
				.where(eq(userTable.id, user.id))
				.execute();
		} catch (e) {
			return setError(form, "", "Unable to restore account");
		}

		return {
			form
		};
	}
};
