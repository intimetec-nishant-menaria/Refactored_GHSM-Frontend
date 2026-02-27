import type { RoomTypesPayload } from "@/utils/interfaces/roomTypes";
import Input from "../common/input/Input";
import { useState, type ChangeEvent } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { fetchRooms, updateRoom } from "@/app/asyncThunk/roomThunk";
import toast from "react-hot-toast";

const numberRegex = /^\d*$/;

interface Props{
    closeModal :()=>void;
    room : RoomTypesPayload;
}

function UpdateRoomModel({closeModal , room}:Props){
    const dispatch = useAppDispatch();
    
    const [numberError , setNumberError] = useState(false);
    const [roomNumber , setRoomNumber ] = useState(room.roomNumber);
    const defaultRoomTypeId = room.roomTypeName == "Single" ? 1 : (room.roomTypeName == "Double" ? 2 : 3);
    const [roomTypeId , setRoomTypeId ] = useState(defaultRoomTypeId);
    const [roomStatus , setRoomStatus] = useState(room.roomStatus);

    function handleOnChange(e : ChangeEvent<HTMLInputElement>){
        if(numberRegex.test(e.target.value) &&  e.target.value.length>0){
            setNumberError(false);
            setRoomNumber(e.target.value);
        }else{
            setNumberError(true);
        }
    }

    function handleOnSubmit(){
        if(room.roomNumber == roomNumber && room.roomStatus == roomStatus && roomTypeId==defaultRoomTypeId)
            return;

        if(!numberError){
            dispatch(updateRoom({ id:room.id ,roomNumber ,roomTypeId ,roomStatus})).then((resultAction) => {
            if (updateRoom.fulfilled.match(resultAction)) {
            toast.success("Room Updated successful!");
            } else {
                toast.error(
                (resultAction.payload as string) || "Failed to update room",
                );
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
              <Input type="text" value={room.roomNumber} id="RoomNumber" onChange={handleOnChange}></Input>
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
              <label htmlFor="RoomType">Select Room Status</label>
              <div className="mt-1">
                <select id="RoomType"
                    onChange={(e:ChangeEvent<HTMLInputElement>)=>setRoomStatus(Number(e.target.value))} 
                    value={roomStatus} className="border p-2 rounded focus:ring-2 focus:ring-blue-500">
                  <option key="1" value={1}>Available</option>
                  <option key="2" value={2}>Occupied</option>
                  <option key="3" value={3}>maintenance</option>
                  <option key="4" value={4}>Out Of Order</option>
                </select>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
              Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
              ✓
              </button>
            </div>
          </div>
        </form>
        </div>
    )
}

export default UpdateRoomModel;