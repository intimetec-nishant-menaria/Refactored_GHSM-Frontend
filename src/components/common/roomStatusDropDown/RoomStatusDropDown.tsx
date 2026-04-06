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
            <label 
                htmlFor="RoomStatus" 
                className="text-[11px] font-black uppercase tracking-widest text-text-muted/60 ml-1"
            >
                Filter by Status
            </label>
            <select 
                id="RoomStatus"
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setRoomStatus(Number(e.target.value))} 
                value={roomStatus} 
                className="border border-border p-3 rounded-xl focus:ring-4 focus:ring-primary/5 bg-layout/30 text-text-main font-bold outline-none transition-all cursor-pointer"
            >
                <option value={0}>All Statuses</option>
                <option value={1}>Available</option>
                <option value={2}>Occupied</option>
                <option value={3}>Maintenance</option>
                <option value={4}>Out Of Order</option>
            </select>
        </div>
    )
}

export default RoomStatusDropDown;