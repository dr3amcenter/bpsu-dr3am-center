import { superValidate } from "sveltekit-superforms";
import type { PageServerLoad } from "./$types";
import {
	createAccountSchema,
	deleteAccountSchema,
	editAccountSchema,
	restoreAccountSchema
} from "./(data)/schema";

import { zod } from "sveltekit-superforms/adapters";

export const load: PageServerLoad = async () => {
	return {
		createAccountForm: await superValidate(zod(createAccountSchema)),
		deleteAccountForm: await superValidate(zod(deleteAccountSchema)),
		editAccountForm: await superValidate(zod(editAccountSchema)),
		restoreAccountForm: await superValidate(zod(restoreAccountSchema))
	};
};
