import {z } from "zod"

export const updateUserSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .nonempty("Name is Required"),

  email: z
    .string()
    .nonempty("Email is required")
    .regex(/^[a-zA-Z0-9._%+-]+@intimetec\.com$/, "Email must be an @intimetec.com address"),

  role:z.string(),

  isActive: z.boolean(),
});

export type updateUserInput = z.infer<typeof updateUserSchema>;
