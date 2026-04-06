import { z } from "zod";
import dayjs from "dayjs";

export const BookingSchema = z.object({
  id : z.number().optional(),
  bugId : z.number().min(1,"Please enter a valid Bug Number"),
  guestName: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name is too long"),
  
  guestEmail: z
    .string()
    .nonempty("Email is required")
    .regex(/^[a-zA-Z0-9._%+-]+@intimetec\.com$/, "Email must be an @intimetec.com address"),

  
  gender: z
    .number()
    .min(1, "Please select a gender"),

  roomId: z
    .number()
    .min(1, "Please select an available room from the list"),

  checkInDate: z.any().refine((val) => dayjs(val).isValid(), {
    message: "Check-in date is required",
  }),
  
  checkOutDate: z.any().refine((val) => dayjs(val).isValid(), {
    message: "Check-out date is required",
  }),
})
.refine((data) => data.checkOutDate >= data.checkInDate, {
  message: "Check-out date must be after the check-in date",
  path: ["CheckOutDate"], 
});

export type BookingInput = z.infer<typeof BookingSchema>;