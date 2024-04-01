import { relations, type InferSelectModel } from "drizzle-orm";
import {
	boolean,
	decimal,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid
} from "drizzle-orm/pg-core";

const transactionTypes = ["incoming", "outgoing"] as const;

export type TransactionType = (typeof transactionTypes)[number];

export const transactionTypeEnum = pgEnum("transaction_type_enum", transactionTypes);

const transactionStatuses = ["pending", "approved", "declined"] as const;

export type TransactionStatus = (typeof transactionStatuses)[number];

export const transactionStatusEnum = pgEnum("transaction_status_enum", transactionStatuses);

const roles = ["admin", "user"] as const;
export type Roles = (typeof roles)[number];

export const roleEnum = pgEnum("user_role_enum", roles);

export const userTable = pgTable("auth_user", {
	id: text("id").primaryKey(),
	username: text("username").notNull().unique(),
	hashed_password: text("hashed_password").notNull(),
	fullName: text("full_name").notNull(),
	role: roleEnum("role").notNull().default("user"),
	isDeleted: boolean("is_deleted").notNull().default(false),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow().notNull()
});

export const sessionTable = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userTable.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull()
});

export const equipmentTable = pgTable("equipment", {
	id: uuid("id").defaultRandom().primaryKey(),
	code: text("code"),
	item: text("item").notNull(),
	category: text("category").notNull(),
	incoming: integer("incoming").notNull().default(0),
	outgoing: integer("outgoing").notNull().default(0),
	onHand: integer("on_hand").notNull().default(0),
	classification: text("classification"),
	expiryDate: timestamp("expiry_date", { withTimezone: true, mode: "date" }),
	specification: text("specification"),
	hasExpired: boolean("has_expired").notNull().default(false),
	availability: text("availability").notNull(),
	location: text("location").notNull(),
	brand: text("brand"),
	dateAcquired: timestamp("date_acquired", { withTimezone: true, mode: "date" }),
	acquisitionCost: decimal("acquisition_cost"),
	serialNumber: text("serial_number"),
	controlNumber: text("control_number"),
	maintenanceInMonths: integer("maintenance_in_months"),
	maintenanceCost: decimal("maintenance_cost"),
	consumability: text("consumability").notNull(),
	isDeleted: boolean("is_deleted").default(false),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "date" })
});

export const transactionTable = pgTable("transaction", {
	id: uuid("id").defaultRandom().primaryKey(),
	equipmentId: uuid("equipment_id")
		.notNull()
		.references(() => equipmentTable.id, {
			onDelete: "cascade"
		}),
	quantity: integer("quantity").notNull(),
	status: transactionStatusEnum("status").notNull().default("pending"),
	type: transactionTypeEnum("type").notNull().default("incoming"),
	requesterId: text("requester_id")
		.notNull()
		.references(() => userTable.id),
	approverId: text("approver_id").references(() => userTable.id),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow().notNull()
});

export const categoryTable = pgTable("category", {
	categoryName: text("category_name").primaryKey(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow().notNull()
});

export const locationTable = pgTable("location", {
	locationName: text("location_name").primaryKey(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow().notNull()
});

export const brandTable = pgTable("brand", {
	brandName: text("brand_name").primaryKey(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow().notNull()
});

export const classificationTable = pgTable("classification", {
	classificationName: text("classification_name").primaryKey(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: "date" }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" }).defaultNow().notNull()
});

export const equipmentRelations = relations(equipmentTable, ({ many }) => ({
	transactions: many(transactionTable)
}));

export const transactionRelations = relations(transactionTable, ({ one }) => ({
	approver: one(userTable, {
		fields: [transactionTable.approverId],
		references: [userTable.id]
	}),
	requester: one(userTable, {
		fields: [transactionTable.requesterId],
		references: [userTable.id]
	}),
	equipment: one(equipmentTable, {
		fields: [transactionTable.equipmentId],
		references: [equipmentTable.id]
	})
}));

export type User = InferSelectModel<typeof userTable>;
export type Equipment = InferSelectModel<typeof equipmentTable>;
export type Transaction = InferSelectModel<typeof transactionTable>;

export type TransactionWithRelations = Transaction & {
	approver: User | null;
	requester: User;
	equipment: Equipment;
};
