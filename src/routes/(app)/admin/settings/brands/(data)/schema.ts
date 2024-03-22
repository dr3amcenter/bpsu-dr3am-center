import { z } from "zod";

export const newBrandsSchema = z.object({
	brands: z
		.array(z.string().trim().min(1, "You must fill in this brand"))
		.min(1, "You must include at least one brand")
		.default([""])
});

export type NewBrandsSchema = typeof newBrandsSchema;

export const deleteBrandSchema = z.object({
	brandName: z.string().trim().min(1, "You must select a brand"),
	cascade: z.boolean().optional()
});

export type DeleteBrandSchema = typeof deleteBrandSchema;

export const editBrandSchema = z
	.object({
		brandName: z.string().trim().min(1, "You must select a brand"),
		newName: z.string().trim().min(1, "You must enter a new brand name"),
		cascade: z.boolean().default(false)
	})
	.refine(
		({ brandName, newName }) => {
			return brandName.toUpperCase() !== newName.toUpperCase();
		},
		{ message: "You must enter a new brand name", path: ["newName"] }
	);

export type EditBrandSchema = typeof editBrandSchema;
