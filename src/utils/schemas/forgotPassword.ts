import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .nonempty("Email is required")
    .regex(/^[a-zA-Z0-9._%+-]+@intimetec\.com$/, "Email must be an @intimetec.com address"),

});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
