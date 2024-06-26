import { z } from "zod";

export const createClassificationsSchema = z.object({
	classifications: z
		.array(z.string().trim().min(1, "You must fill in this classification"))
		.min(1, "You must include at least one classification")
		.default([""])
});

export const deleteClassificationSchema = z.object({
	classificationName: z.string().trim().min(1, "You must select a classification"),
	cascade: z.boolean().optional()
});

export const editClassificationSchema = z
	.object({
		classificationName: z.string().trim().min(1, "You must select a classification"),
		newName: z.string().trim().min(1, "You must enter a new classification name"),
		cascade: z.boolean().default(false)
	})
	.refine(
		({ classificationName, newName }) => {
			return classificationName.toUpperCase() !== newName.toUpperCase();
		},
		{ message: "You must enter a new classification name", path: ["newName"] }
	);
