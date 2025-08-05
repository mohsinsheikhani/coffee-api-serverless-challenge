import { z } from "zod";

export const CreateCoffeeSchema = z.object({
  name: z.string().min(1).trim(),
  description: z.string().min(1).trim(),
  price: z.number().positive(),
  category: z.string().min(1).trim(),
  available: z.boolean().optional(),
});

export const UpdateCoffeeSchema = z
  .object({
    name: z.string().min(1).trim().optional(),
    description: z.string().min(1).trim().optional(),
    price: z.number().positive().optional(),
    category: z.string().min(1).trim().optional(),
    available: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field required for update",
  });

export type CreateCoffeeInput = z.infer<typeof CreateCoffeeSchema>;
export type UpdateCoffeeInput = z.infer<typeof UpdateCoffeeSchema>;

export const validateCreateCoffeeRequest = (data: unknown) => {
  const result = CreateCoffeeSchema.safeParse(data);
  return {
    isValid: result.success,
    errors: result.success ? [] : result.error.issues.map((e) => e.message),
  };
};

export const validateUpdateCoffeeRequest = (data: unknown) => {
  const result = UpdateCoffeeSchema.safeParse(data);
  return {
    isValid: result.success,
    errors: result.success ? [] : result.error.issues.map((e) => e.message),
  };
};
