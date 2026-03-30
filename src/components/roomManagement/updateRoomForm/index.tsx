import { useState, type ChangeEvent, type FormEvent } from "react";
import Input from "../../common/input/Input";
import toast from "react-hot-toast";
import { useUpdateRoomMutation } from "@/app/Api's/room";
import type { UpdateModelProps } from "@/utils/interfaces/updateModel";
import type { RoomData } from "@/utils/interfaces/room";

const numberRegex = /^\d+$/;

function UpdateRoomForm({ data, closeModel }: UpdateModelProps<RoomData>) {
  const [roomNumber, setRoomNumber] = useState(data.roomNumber);
  const [floor, setFloor] = useState(data.floor);
  const [status, setStatus] = useState(data.status);
  
  const [numberError, setNumberError] = useState(false);
  const [floorError, setFloorError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [updateRoom] = useUpdateRoomMutation();

  async function handleOnSubmit(e: FormEvent) {
    e.preventDefault();
    
    const isRoomEmpty = roomNumber.trim() === "";

    if (isRoomEmpty || floor==0) {
      if (isRoomEmpty) setNumberError(true);
      if (floor==0) setFloorError(true);
      return;
    }

    if (!numberError && !floorError) {
      setIsSubmitting(true);
      try {
        await updateRoom({ 
          id: data.id,          
          roomNumber: roomNumber, 
          status: Number(status), 
          floor: Number(floor)   
        }).unwrap();
        
        toast.success("Room updated successfully!");
        closeModel();
      } catch (error: any) {
        toast.error(error?.data?.message || "Something went wrong");
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  function handleRoomChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setRoomNumber(value);
    setNumberError(!numberRegex.test(value));
  }

  function handleFloorChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setFloor(value);
    setFloorError(!numberRegex.test(value));
  }

  return (
    <form onSubmit={handleOnSubmit} className="p-8 flex flex-col gap-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="RoomNumber" className="text-sm font-semibold text-slate-700">
            Room Number
          </label>
          <Input
            type="text"
            id="RoomNumber"
            value={roomNumber}
            onChange={handleRoomChange}
            className={numberError ? "border-red-500" : ""}
          />
          {numberError && <p className="text-red-500 text-xs italic">Numeric room number required.</p>}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="Floor" className="text-sm font-semibold text-slate-700">
            Room Floor
          </label>
          <Input
            type="text"
            id="Floor"
            value={floor}
            onChange={handleFloorChange}
            className={floorError ? "border-red-500" : ""}
          />
          {floorError && <p className="text-red-500 text-xs italic">Enter a valid floor number.</p>}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="Status" className="text-sm font-semibold text-slate-700">
            Room Status
          </label>
          <select
            id="Status"
            value={status}
            onChange={(e) => setStatus(Number(e.target.value))}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-700"
          >
            <option value={1}>Available</option>
            <option value={2}>Occupied</option>
            <option value={3}>Maintenance</option>
            <option value={4}>Out Of Order</option>
          </select>
        </div>

      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
        <button
          type="button"
          onClick={closeModel}
          className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || numberError || floorError}
          className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl disabled:bg-blue-400"
        >
          {isSubmitting ? "Updating..." : "Update Room"}
        </button>
      </div>
    </form>
  );
}

export default UpdateRoomForm;