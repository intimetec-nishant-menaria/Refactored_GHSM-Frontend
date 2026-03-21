import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
