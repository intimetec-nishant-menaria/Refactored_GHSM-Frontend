import type { ChangeEvent } from "react";

function RoomStatusDropDown({
    roomStatus,
    setRoomStatus
    }: {
    roomStatus : number;
    setRoomStatus : (value:number)=>void;
    }){
    return(
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
    )
}

export default RoomStatusDropDown;