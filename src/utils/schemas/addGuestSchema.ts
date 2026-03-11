import { z } from "zod";

export const addGuestSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  contact: z
    .string()
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number cannot exceed 15 digits")
    .regex(/^[0-9]+$/, "Contact must contain only numbers"),

  email: z
    .string()
    .email("Invalid email address"),

  idProof: z
    .string()
    .min(3, "ID Proof is required"),

  address: z
    .string()
    .min(5, "Address is required"),

  emergencyContact: z
    .string()
    .min(10, "Emergency contact must be at least 10 digits")
    .max(15, "Emergency contact cannot exceed 15 digits")
    .regex(/^[0-9]+$/, "Emergency contact must contain only numbers"),
});

export type addGuestInput = z.infer<typeof addGuestSchema>;