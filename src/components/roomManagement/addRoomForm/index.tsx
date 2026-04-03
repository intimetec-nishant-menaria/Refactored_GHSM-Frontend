import { useState} from "react";
import Input from "../../common/input/Input";
import toast from "react-hot-toast";
import { useAddRoomMutation } from "@/app/Api's/room";
import { useForm } from "react-hook-form";
import { addRoomSchema, type addRoom } from "@/utils/schemas/addRoom";
import { zodResolver } from "@hookform/resolvers/zod";

function AddRoomForm({ closeModel }: { closeModel: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addRoom] = useAddRoomMutation();

  const {
    register,
    handleSubmit,
    formState : {errors}
  } = useForm<addRoom>({
    resolver : zodResolver(addRoomSchema)
  })

  async function handleOnSubmit(data:addRoom) {
      setIsSubmitting(true);
      try {
        await addRoom(data).unwrap();
        
        toast.success("Room added successfully!");
        closeModel();
      } catch (error: any) {
        toast.error(error?.data?.message || "Something went wrong");
      } finally {
        setIsSubmitting(false);
      }
  }

  return (
    <form onSubmit={handleSubmit(handleOnSubmit)} className="p-8 flex flex-col gap-6">
      <div className="flex flex-col gap-5">
        
        <div className="flex flex-col gap-2">
          <label htmlFor="RoomNumber" className="text-sm font-semibold text-slate-700">
            Room Number
          </label>
          <Input
            type="text"
            id="RoomNumber"
            placeholder="e.g. 101"
            {...register("roomNumber")}
            className={errors.roomNumber ? "border-red-500 focus:ring-red-100" : ""}
          />
          {errors.roomNumber && (
            <p className="text-red-500 text-xs font-medium italic">
              Room Number must be a valid numeric value.
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="Floor" className="text-sm font-semibold text-slate-700">
            Room Floor
          </label>
          <Input
            type="text"
            id="Floor"
            placeholder="e.g. 1"
            {...register("floor" , {valueAsNumber : true})}
            className={errors.floor ? "border-red-500 focus:ring-red-100" : ""}
          />
          {errors.floor && (
            <p className="text-red-500 text-xs font-medium italic">
              Please enter a valid floor number.
            </p>
          )}
        </div>

      </div>
      <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
        <button
          type="button"
          onClick={closeModel}
          className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:bg-blue-400 flex justify-center items-center gap-2"
        >
          {isSubmitting ? "Adding..." : "Confirm Add"}
          {!isSubmitting && <span className="text-lg">✓</span>}
        </button>
      </div>
    </form>
  );
}

export default AddRoomForm;