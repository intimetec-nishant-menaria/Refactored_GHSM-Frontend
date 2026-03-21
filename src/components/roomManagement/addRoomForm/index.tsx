import { useState, type ChangeEvent } from "react";
import Input from "../../common/input/Input";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { addRoom, fetchRooms } from "@/app/asyncThunk/room";
import toast from "react-hot-toast";

const numberRegex = /^\d*$/;

function AddRoomForm({ closeModel }:{closeModel:()=>void}) {
  const dispatch = useAppDispatch();

  const [roomNumber, setRoomNumber] = useState("");
  const [roomTypeId, setRoomTypeId] = useState(1);
  const [numberError, setNumberError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleOnSubmit(e: ChangeEvent) {
    e.preventDefault(); 

    if (roomNumber.trim() === "") {
      setNumberError(true);
      return;
    }

    if (!numberError) {
      setIsSubmitting(true);
      try {
        const resultAction = await dispatch(addRoom({ roomNumber, roomTypeId }));
        
        if (addRoom.fulfilled.match(resultAction)) {
          toast.success("Room added successfully!");
          await dispatch(fetchRooms({currentPage:1 , pageSize:5 , roomStatusFilter:0 , roomTypeFilter:0}));
          closeModel();
        } else {
          toast.error((resultAction.payload as string) || "Failed to add room");
        }
      } catch (error) {
        toast.error("Something went wrong");
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (numberRegex.test(value)) {
      setNumberError(false);
      setRoomNumber(value);
    } else {
      setNumberError(true);
    }
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
                placeholder="e.g. 101"
                onChange={handleOnChange}
                className={numberError ? "border-red-500 focus:ring-red-100" : ""}
              />
              {numberError && (
                <p className="text-red-500 text-xs font-medium italic">
                  Room Number must be a valid numeric value.
                </p>
              )}
            </div>
            <div className="flex-col flex gap-2">
              <label htmlFor="RoomType" className="text-sm font-semibold text-slate-700">
                Room Type
              </label>
              <select 
                id="RoomType"
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setRoomTypeId(Number(e.target.value))} 
                value={roomTypeId}
                className="border w-full border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-100 bg-white outline-none transition-all cursor-pointer"
              >
                <option value={1}>Single Room</option>
                <option value={2}>Double Room</option>
                <option value={3}>Luxury Suite</option>
              </select>
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