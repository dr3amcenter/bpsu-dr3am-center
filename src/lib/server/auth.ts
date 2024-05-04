import { Lucia } from "lucia";
import { dev } from "$app/environment";

import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "./db";
import { sessionTable, userTable, type Roles } from "./db/schema";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			// set to `true` when using HTTPS
			secure: !dev
		}
	},
	getUserAttributes: (attributes) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			username: attributes.username,
			role: attributes.role,
			fullName: attributes.fullName,
			createdAt: attributes.createdAt,
			updatedAt: attributes.updatedAt,
			isDeleted: attributes.isDeleted
		};
	}
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	username: string;
	role: Roles;
	fullName: string;
	updatedAt: Date;
	createdAt: Date;
	isDeleted: boolean;
}
