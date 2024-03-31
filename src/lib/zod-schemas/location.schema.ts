import { z } from "zod";

export const createLocationsSchema = z.object({
	locations: z
		.array(z.string().trim().min(1, "You must fill in this location"))
		.min(1, "You must include at least one location")
		.default([""])
});

export const deleteLocationSchema = z.object({
	locationName: z.string().trim().min(1, "You must select a location"),
	cascade: z.boolean().optional()
});

export const editLocationSchema = z
	.object({
		locationName: z.string().trim().min(1, "You must select a location"),
		newName: z.string().trim().min(1, "You must enter a new location name"),
		cascade: z.boolean().default(false)
	})
	.refine(
		({ locationName, newName }) => {
			return locationName.toUpperCase() !== newName.toUpperCase();
		},
		{ message: "You must enter a new location name", path: ["newName"] }
	);
