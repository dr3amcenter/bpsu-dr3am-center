import { setError, superValidate } from "sveltekit-superforms";
import type { PageServerLoad, Actions } from "./$types";
import { loginSchema } from "$lib/zod-schemas";

import { zod } from "sveltekit-superforms/adapters";
import { fail, redirect } from "@sveltejs/kit";

import { db } from "$lib/server/db";

import { lucia } from "$lib/server/auth";
import { Argon2id } from "oslo/password";

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		redirect(303, `/${event.locals.user.role}/dashboard`);
	}

	return {
		form: await superValidate(zod(loginSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(loginSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { password, username } = form.data;

		const existingUser = await db.query.userTable.findFirst({
			where: (userTable, { eq }) => eq(userTable.username, username.toLowerCase())
		});

		if (!existingUser) {
			return setError(form, "", "Incorrect username or password");
		}

		const validPassword = await new Argon2id().verify(existingUser.hashed_password, password);

		if (!validPassword) {
			return setError(form, "", "Incorrect username or password");
		}

		if (existingUser.isDeleted) {
			return setError(form, "", "Account is inactive");
		}

		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: ".",
			...sessionCookie.attributes
		});

		redirect(302, `/${existingUser.role}/dashboard`);
	}
};
