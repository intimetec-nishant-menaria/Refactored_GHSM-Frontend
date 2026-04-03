import { z } from "zod";


export const updateRoomSchema = z.object({
    id : z.number(),
    roomNumber : z.string().nonempty("Room number is required"),
    floor : z.number().min(1 , "Floor is required"),
    status : z.number().min(1).max(4),
})

export type updateRoom = z.infer<typeof updateRoomSchema>;