import { db } from "$lib/server/db";
import {
	brandTable,
	categoryTable,
	classificationTable,
	equipmentTable,
	locationTable
} from "$lib/server/db/schema";
import type { Actions, PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { addIncomingItemAction, addOutgoingItemAction } from "$lib/server/item";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { addIncomingItemSchema, addOutgoingItemSchema } from "$lib/zod-schemas/item.schema";
import { and, eq, gte, inArray, isNotNull, lt, lte, or } from "drizzle-orm";
import { addDays, isValid } from "date-fns";

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) redirect(302, "/login");
	if (event.locals.user.role !== "admin") redirect(302, "/user/inventory");

	const { url } = event;
	const availabilitiesParams = url.searchParams.get("availabilities");
	const consumabilitiesParams = url.searchParams.get("consumabilities");
	const categoriesParams = url.searchParams.get("categories");
	const locationsParams = url.searchParams.get("locations");
	const brandsParams = url.searchParams.get("brands");
	const classificationsParams = url.searchParams.get("classifications");

	const acquiredDateStart = url.searchParams.get("acquiredDateStart");
	const acquiredDateEnd = url.searchParams.get("acquiredDateEnd");

	const acquisitionCostStart = url.searchParams.get("acquisitionCostStart");
	const acquisitionCostEnd = url.searchParams.get("acquisitionCostEnd");

	const maintenanceCostStart = url.searchParams.get("maintenanceCostStart");
	const maintenanceCostEnd = url.searchParams.get("maintenanceCostEnd");

	const onHandStart = url.searchParams.get("onHandStart");
	const onHandEnd = url.searchParams.get("onHandEnd");

	const incomingStart = url.searchParams.get("incomingStart");
	const incomingEnd = url.searchParams.get("incomingEnd");

	const outgoingStart = url.searchParams.get("outgoingStart");
	const outgoingEnd = url.searchParams.get("outgoingEnd");

	const maintenanceInMonthsStart = url.searchParams.get("maintenanceInMonthsStart");
	const maintenanceInMonthsEnd = url.searchParams.get("maintenanceInMonthsEnd");

	const hasExpired = Boolean(url.searchParams.get("hasExpired"));
	const hasExpiredin30D = Boolean(url.searchParams.get("hasExpiredin30D"));
	const hasExpiredin6M = Boolean(url.searchParams.get("hasExpiredin6M"));

	return {
		equipments: await db
			.select()
			.from(equipmentTable)
			.where(
				and(
					eq(equipmentTable.isDeleted, false),
					availabilitiesParams?.split(",")
						? inArray(equipmentTable.availability, availabilitiesParams?.split(","))
						: undefined,
					consumabilitiesParams?.split(",")
						? inArray(equipmentTable.consumability, consumabilitiesParams?.split(","))
						: undefined,
					categoriesParams?.split(",")
						? inArray(equipmentTable.category, categoriesParams?.split(","))
						: undefined,
					locationsParams?.split(",")
						? inArray(equipmentTable.location, locationsParams?.split(","))
						: undefined,
					brandsParams?.split(",")
						? inArray(equipmentTable.brand, brandsParams?.split(","))
						: undefined,
					classificationsParams?.split(",")
						? inArray(equipmentTable.classification, classificationsParams?.split(","))
						: undefined,
					acquiredDateStart && isValid(new Date(acquiredDateStart))
						? gte(equipmentTable.dateAcquired, new Date(acquiredDateStart))
						: undefined,
					acquiredDateEnd && isValid(new Date(acquiredDateEnd))
						? lte(equipmentTable.dateAcquired, new Date(acquiredDateEnd))
						: undefined,
					acquisitionCostStart && parseFloat(acquisitionCostStart)
						? gte(equipmentTable.acquisitionCost, acquisitionCostStart)
						: undefined,
					acquisitionCostEnd && parseFloat(acquisitionCostEnd)
						? lte(equipmentTable.acquisitionCost, acquisitionCostEnd)
						: undefined,
					maintenanceCostStart && parseFloat(maintenanceCostStart)
						? gte(equipmentTable.maintenanceCost, maintenanceCostStart)
						: undefined,
					maintenanceCostEnd && parseFloat(maintenanceCostEnd)
						? lte(equipmentTable.maintenanceCost, maintenanceCostEnd)
						: undefined,
					onHandStart && Number(onHandStart)
						? gte(equipmentTable.onHand, Number(onHandStart))
						: undefined,
					onHandEnd && Number(onHandEnd)
						? lte(equipmentTable.onHand, Number(onHandEnd))
						: undefined,
					incomingStart && Number(incomingStart)
						? gte(equipmentTable.incoming, Number(incomingStart))
						: undefined,
					incomingEnd && Number(incomingEnd)
						? lte(equipmentTable.incoming, Number(incomingEnd))
						: undefined,
					outgoingStart && Number(outgoingStart)
						? gte(equipmentTable.outgoing, Number(outgoingStart))
						: undefined,
					outgoingEnd && Number(outgoingEnd)
						? lte(equipmentTable.outgoing, Number(outgoingEnd))
						: undefined,
					maintenanceInMonthsStart && Number(maintenanceInMonthsStart)
						? gte(equipmentTable.maintenanceInMonths, Number(maintenanceInMonthsStart))
						: undefined,
					maintenanceInMonthsEnd && Number(maintenanceInMonthsEnd)
						? lte(equipmentTable.maintenanceInMonths, Number(maintenanceInMonthsEnd))
						: undefined,
					hasExpired && Boolean(hasExpired)
						? or(eq(equipmentTable.hasExpired, true), lt(equipmentTable.expiryDate, new Date()))
						: undefined,
					hasExpiredin30D && !hasExpired && Boolean(hasExpiredin30D)
						? and(
								isNotNull(equipmentTable.expiryDate),
								gte(equipmentTable.expiryDate, new Date()),
								lt(equipmentTable.expiryDate, addDays(new Date(), 30))
							)
						: undefined,
					hasExpiredin6M && !hasExpired && Boolean(hasExpiredin6M)
						? and(
								isNotNull(equipmentTable.expiryDate),
								gte(equipmentTable.expiryDate, new Date()),
								lt(equipmentTable.expiryDate, addDays(new Date(), 180))
							)
						: undefined
				)
			),
		addIncomingItemForm: await superValidate(zod(addIncomingItemSchema)),
		addOutgoingItemForm: await superValidate(zod(addOutgoingItemSchema)),

		brands: await db
			.select({
				brandName: brandTable.brandName
			})
			.from(brandTable),
		categories: await db
			.select({
				categoryName: categoryTable.categoryName
			})
			.from(categoryTable),
		locations: await db
			.select({
				locationName: locationTable.locationName
			})
			.from(locationTable),
		classifications: await db
			.select({
				classificationName: classificationTable.classificationName
			})
			.from(classificationTable)
	};
};

export const actions: Actions = {
	addIncomingItem: addIncomingItemAction,
	addOutgoingItem: addOutgoingItemAction
};
