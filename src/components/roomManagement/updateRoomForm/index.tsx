import { useState } from "react";
import Input from "../../common/input/Input";
import toast from "react-hot-toast";
import { useUpdateRoomMutation } from "@/app/Api/room";
import type { UpdateModelProps } from "@/utils/interfaces/updateModel";
import type { RoomData } from "@/utils/interfaces/room";
import { useForm } from "react-hook-form";
import { updateRoomSchema, type updateRoom } from "@/utils/schemas/updateRoom";
import { zodResolver } from "@hookform/resolvers/zod";

function UpdateRoomForm({ data, closeModel }: UpdateModelProps<RoomData>) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<updateRoom>({
    resolver: zodResolver(updateRoomSchema),
    defaultValues: {
      id: data.id,
      floor: data.floor,
      roomNumber: data.roomNumber,
      status: data.status
    }
  })
  
  const [updateRoom] = useUpdateRoomMutation();

  async function handleOnSubmit(formData: updateRoom) {
      setIsSubmitting(true);
      try {
        await updateRoom(formData).unwrap();
        toast.success("Room updated successfully!");
        closeModel();
      } catch (error: any) {
        toast.error(error?.data?.message || "Something went wrong");
      } finally {
        setIsSubmitting(false);
      }
  }

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)} className="p-8 flex flex-col gap-6 bg-surface">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="RoomNumber" className="text-sm font-semibold text-text-main">
            Room Number
          </label>
          <Input
            type="text"
            id="RoomNumber"
            {...register("roomNumber")}
            className={`bg-layout/10 text-text-main ${errors.roomNumber ? "border-danger focus:ring-danger/10" : "border-border focus:ring-primary/10"}`}
          />
          {errors.roomNumber && <p className="text-danger text-xs font-medium italic">Numeric room number required.</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="Floor" className="text-sm font-semibold text-text-main">
            Room Floor
          </label>
          <Input
            type="text"
            id="Floor"
            {...register("floor", { valueAsNumber: true })}
            className={`bg-layout/10 text-text-main ${errors.floor ? "border-danger focus:ring-danger/10" : "border-border focus:ring-primary/10"}`}
          />
          {errors.floor && <p className="text-danger text-xs font-medium italic">Enter a valid floor number.</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="Status" className="text-sm font-semibold text-text-main">
            Room Status
          </label>
          <select
            id="Status"
            {...register("status", { valueAsNumber: true })}
            className="w-full px-4 py-2.5 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 bg-layout/10 text-text-main font-medium cursor-pointer transition-all"
          >
            <option value={1}>Available</option>
            <option value={2}>Occupied</option>
            <option value={3}>Maintenance</option>
            <option value={4}>Out Of Order</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-muted">
        <button
          type="button"
          onClick={closeModel}
          className="flex-1 px-4 py-3 bg-muted text-text-muted font-bold rounded-xl hover:bg-border transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !!errors.roomNumber || !!errors.floor}
          className="flex-1 px-4 py-3 bg-primary text-surface font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-hover transition-all active:scale-95 disabled:bg-primary/40 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Updating..." : "Update Room"}
        </button>
      </div>
    </form>
  );
}

export default UpdateRoomForm;