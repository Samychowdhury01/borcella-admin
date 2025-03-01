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
  media: z.array(string()).nonempty(),
  category: z.string(),
  collectionIds: z.array(string()).nonempty(),
  tags: z.array(string()).nonempty(),
  sizes: z.array(string()).nonempty(),
  colors: z.array(string()).nonempty(),
  price: z.coerce.number()
  .positive()
  .min(1, {
    message: "Price must be greater than 0",
  }),
  expense: z.coerce.number()
  .positive()
  .min(1, {
    message: "Expense must be greater than 0",
  }),
});

export type TCreateProductFormSchema = z.infer<typeof createProductFormSchema>;
