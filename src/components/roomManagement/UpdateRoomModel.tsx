import type { RoomTypesPayload } from "@/utils/interfaces/roomTypes";
import Input from "../common/input/Input";
import { useState, type ChangeEvent } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { fetchRooms, updateRoom } from "@/app/asyncThunk/roomThunk";
import toast from "react-hot-toast";
import type { UpdateModelProps } from "@/utils/interfaces/updateModel";

const numberRegex = /^\d*$/;

function UpdateRoomModel({ closeModel, data }: UpdateModelProps<RoomTypesPayload>) {
  const dispatch = useAppDispatch();

  const [numberError, setNumberError] = useState(false);
  const [roomNumber, setRoomNumber] = useState(data.roomNumber);
  
  const defaultRoomTypeId = data.roomTypeName === "Single" ? 1 : (data.roomTypeName === "Double" ? 2 : 3);
  const [roomTypeId, setRoomTypeId] = useState(defaultRoomTypeId);
  const [roomStatus, setRoomStatus] = useState(data.roomStatus);

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (numberRegex.test(value) && value.length > 0) {
      setNumberError(false);
      setRoomNumber(value);
    } else {
      setNumberError(true);
      setRoomNumber(value); 
    }
  }

  async function handleOnSubmit(e: ChangeEvent) {
    e.preventDefault(); 
    if (data.roomNumber === roomNumber && data.roomStatus === roomStatus && roomTypeId === defaultRoomTypeId) {
      closeModel();
      return;
    }

    if (!numberError) {
      dispatch(updateRoom({ id: data.id, roomNumber, roomTypeId, roomStatus })).then((resultAction) => {
        if (updateRoom.fulfilled.match(resultAction)) {
          toast.success("Room Updated successfully!");
          dispatch(fetchRooms());
          closeModel();
        } else {
          toast.error((resultAction.payload as string) || "Failed to update room");
        }
      });
    }
  }

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in duration-300" >
        <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Update Room Details</h2>
          <button onClick={closeModel} className="text-slate-400 hover:text-slate-600 transition-colors">✕</button>
        </div>
        <form onSubmit={handleOnSubmit} className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="RoomNumber" className="text-sm font-semibold text-slate-600">Room Number</label>
            <Input 
              type="text" 
              value={roomNumber} 
              id="RoomNumber" 
              onChange={handleOnChange}
              className={`w-full ${numberError ? 'border-red-500 ring-red-100' : ''}`}
            />
            {numberError && <p className="text-xs text-red-500 font-medium italic">Please enter a valid numeric room number.</p>}
          </div>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <label htmlFor="RoomType" className="text-sm font-semibold text-slate-600">Room Type</label>
              <select 
                id="RoomType"
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setRoomTypeId(Number(e.target.value))} 
                value={roomTypeId} 
                className="border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white outline-none transition-all cursor-pointer"
              >
                <option value={1}>Single</option>
                <option value={2}>Double</option>
                <option value={3}>Suite</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-2">
              <label htmlFor="RoomStatus" className="text-sm font-semibold text-slate-600">Room Status</label>
              <select 
                id="RoomStatus"
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setRoomStatus(Number(e.target.value))} 
                value={roomStatus} 
                className="border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white outline-none transition-all cursor-pointer"
              >
                <option value={1}>Available</option>
                <option value={2}>Occupied</option>
                <option value={3}>Maintenance</option>
                <option value={4}>Out Of Order</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={closeModel}
              className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 flex justify-center items-center gap-2"
            >
              <span>Update Room</span>
              <span className="text-lg">✓</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateRoomModel;