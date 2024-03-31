import { z } from "zod";

export const createCategoriesSchema = z.object({
	categories: z
		.array(z.string().trim().min(1, "You must fill in this category"))
		.min(1, "You must include at least one category")
		.default([""])
});

export const deleteCategorySchema = z.object({
	categoryName: z.string().trim().min(1, "You must select a category"),
	cascade: z.boolean().optional()
});

export const editCategorySchema = z
	.object({
		categoryName: z.string().trim().min(1, "You must select a category"),
		newName: z.string().trim().min(1, "You must enter a new category name"),
		cascade: z.boolean().default(false)
	})
	.refine(
		({ categoryName, newName }) => {
			return categoryName.toUpperCase() !== newName.toUpperCase();
		},
		{ message: "You must enter a new category name", path: ["newName"] }
	);
