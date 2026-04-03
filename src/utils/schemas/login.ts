import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .regex(/^[a-zA-Z0-9._%+-]+@intimetec\.com$/, "Email must be an @intimetec.com address"),


  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  rememberMe: z.boolean().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
