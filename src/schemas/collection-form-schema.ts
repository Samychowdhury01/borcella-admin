import { z } from "zod";

export const createCollectionFormSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  description: z
    .string()
    .min(2, {
      message: "Description is required",
    })
    .max(500, {
      message: "Description must be 500 characters or less",
    })
    .trim(),
  imageUrl: z
    .string()
    .min(1, {
      message: "Image URL is required",
    })
    .url({
      message: "Invalid image URL",
    }),
});

export type TCreateCollectionFormSchema = z.infer<
  typeof createCollectionFormSchema
>;
