import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
