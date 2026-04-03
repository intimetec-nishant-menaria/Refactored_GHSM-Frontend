import {z } from "zod"

export const UserSchema = z.object({
  name: z
    .string()
    .nonempty("Name is Required"),

  email: z
    .string()
    .nonempty("Email is required")
    .regex(/^[a-zA-Z0-9._%+-]+@intimetec\.com$/, "Email must be an @intimetec.com address"),

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

export type UserInput = z.infer<typeof UserSchema>;
