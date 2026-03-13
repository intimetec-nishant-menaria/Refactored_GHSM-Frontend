import { z } from "zod";

export const updateGuestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  contact: z.string().min(10, "Contact must be at least 10 digits"),
  idProof: z.string().min(1, "ID Proof is required"),
  Address: z.string().min(5, "Please enter a full address"),
  emergencyContact: z.string().min(10, "Emergency contact must be at least 10 digits"),
});

export type GuestFormData = z.infer<typeof updateGuestSchema>;