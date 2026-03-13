import {z} from 'zod';

export const manualBookingSchema = z.object({
  checkInDate: z.any().refine((val) => val !== null, "Check-in is required"),
  checkOutDate: z.any().refine((val) => val !== null, "Check-out is required"),
  roomId: z.coerce.number().min(1, "Please select a room"), 
  guestId: z.number().min(1, "Select a guest"),
  roomTypeId: z.number().optional(), 
});;

export type ManualBookingData = z.infer<typeof manualBookingSchema>;