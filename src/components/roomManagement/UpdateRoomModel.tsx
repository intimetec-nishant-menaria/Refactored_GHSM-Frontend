import type { RoomTypesPayload } from "@/utils/interfaces/roomTypes";
import Input from "@/components/common/input/index";
import { useState, type ChangeEvent } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { fetchRooms, updateRoom } from "@/app/asyncThunk/roomThunk";
import toast from "react-hot-toast";
import RoomStatusDropDown from "../common/roomStatusDropDown/RoomStatusDropDown";
import type { UpdateModelProps } from "@/utils/interfaces/updateModel";

const numberRegex = /^\d*$/;

function UpdateRoomModel({closeModel , data}:UpdateModelProps<RoomTypesPayload>){
    const dispatch = useAppDispatch();
    
    const [numberError , setNumberError] = useState(false);
    const [roomNumber , setRoomNumber ] = useState(data.roomNumber);
    const defaultRoomTypeId = data.roomTypeName == "Single" ? 1 : (data.roomTypeName == "Double" ? 2 : 3);
    const [roomTypeId , setRoomTypeId ] = useState(defaultRoomTypeId);
    const [roomStatus , setRoomStatus] = useState(data.roomStatus);

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

    async function handleOnSubmit(){
        if(data.roomNumber == roomNumber && data.roomStatus == roomStatus && roomTypeId==defaultRoomTypeId)
            return;

        if(!numberError){
            dispatch(updateRoom({ id:data.id ,roomNumber ,roomTypeId ,roomStatus})).then((resultAction) => {
            if (updateRoom.fulfilled.match(resultAction)) {
            toast.success("Room Updated successful!");
            } else {
                toast.error(
                (resultAction.payload as string) || "Failed to update room",
                );
            }
            }).then(()=>{
              dispatch(fetchRooms());
            });
        }
      });
    }
  }

    return (
        <div className="fixed top-1/4 left-1/2 mt-12 mr-4 w-96 bg-white p-6 rounded-lg shadow-lg z-50">
        <h2 className="text-xl font-bold mb-4">Add Room</h2>
        <form  onSubmit={handleOnSubmit} className="flex flex-col gap-3">
          <div className="flex-col justify-end gap-2 mt-2">
            <div className="mb-2 flex-col ">
              <label htmlFor="RoomNumber">Room Number:</label>
              <Input type="text" value={data.roomNumber} id="RoomNumber" onChange={handleOnChange}></Input>
              {numberError ? <p className="text-red-500">Room Number must be a Number</p> : ""}

              <label htmlFor="RoomType">Select Room Type</label>
              <div className="mt-1">
                <select id="RoomType"
                    onChange={(e:ChangeEvent<HTMLInputElement>)=>setRoomTypeId(Number(e.target.value))} 
                    value={roomTypeId} className="border p-2 rounded focus:ring-2 focus:ring-blue-500">
                  <option key="1" value={1}>Single</option>
                  <option key="2" value={2}>Double</option>
                  <option key="3" value={3}>Suite</option>
                </select>
              </div>
              <RoomStatusDropDown roomStatus={roomStatus} setRoomStatus={setRoomStatus} />
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={closeModel}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
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