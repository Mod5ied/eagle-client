import { z } from 'zod';

export const productFormSchema = z.object({
  name: z.string().min(2),
  sku: z.string().min(2),
  price: z.number().positive(),
  quantity: z.number().int().nonnegative(),
  category: z.string().min(2),
  status: z.enum(['active', 'inactive']).default('active')
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
