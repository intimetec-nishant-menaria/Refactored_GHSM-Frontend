import { z } from "zod";


export const addRoomSchema = z.object({
    roomNumber : z.string().nonempty("Room number is required"),
    floor : z.number().min(1 , "Please select a floor between 1 and 4.").max(4.,"Please select a floor between 1 and 4.")
})

export type addRoom = z.infer<typeof addRoomSchema>;