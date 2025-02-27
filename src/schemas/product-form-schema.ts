import { string, z } from "zod";

export const createProductFormSchema = z.object({
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
  media: z.array(string()),
  category: z.string(),
  collections: z.array(string()),
  tags: z.array(string()),
  sizes: z.array(string()),
  colors: z.array(string()),
  price: z.number()
  .positive()
  .min(1, {
    message: "Price must be greater than 0",
  }),
  expense: z.number()
  .positive()
  .min(1, {
    message: "Expense must be greater than 0",
  }),
});

export type TCreateProductFormSchema = z.infer<typeof createProductFormSchema>;
