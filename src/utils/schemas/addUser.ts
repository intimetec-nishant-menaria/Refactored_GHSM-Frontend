import {z } from "zod"

export const addUserSchema = z.object({
  name: z
    .string()
    .nonempty("Name is Required"),

  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),

  role:z.string(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),

    
  isActive: z.boolean(),
});

export type addUserInput = z.infer<typeof addUserSchema>;
