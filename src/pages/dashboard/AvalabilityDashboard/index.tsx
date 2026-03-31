import { useGetAllAvailableRoomsQuery } from "@/app/Api's/availableRoom";
import DateRangePicker from "@/components/common/DateRangePicker/DateRangePicker";
import type { RoomData } from "@/utils/interfaces/room";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";

const AvailabilityDashboard = () => {
  const [checkInDate, setCheckInDate] = useState<Dayjs | null>(dayjs().startOf("month"));
  const [checkOutDate, setCheckOutDate] = useState<Dayjs | null>(dayjs().endOf("month"));

  const { data: rooms, isLoading } = useGetAllAvailableRoomsQuery({
    checkIn: checkInDate?.toISOString() ?? "",
    checkOut: checkOutDate?.toISOString() ?? "",
    gender: 3,
  }, { 
    skip: !checkInDate || !checkOutDate 
  });

  const handleCheckInClick = (newDate: Dayjs | null) => {
    if (!newDate) return;
    if (checkOutDate && newDate.isAfter(checkOutDate)) setCheckOutDate(null);
    setCheckInDate(newDate);
  };

  const handleCheckOutClick = (newDate: Dayjs | null) => {
    if (!newDate) return;
    if (checkInDate && newDate.isBefore(checkInDate)) {
      setCheckInDate(newDate);
      setCheckOutDate(null);
    } else {
      setCheckOutDate(newDate);
    }
  };

  const getRoomStyle = (occ: number) => {
    if (occ === 0) {
      return { border: 'border-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Fully Available' };
    }
    return { border: 'border-amber-500', text: 'text-amber-600', bg: 'bg-amber-50', label: 'Half Available' };
  };

  return (
    <div className="p-6  min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Room Availability</h1>
      <div className="mb-8 p-4 bg-white rounded-2xl shadow-sm border border-slate-200 inline-flex items-center gap-4">
        <div className="flex items-center gap-2 px-2">
          <span className="text-slate-400">📅</span>
          <DateRangePicker 
            checkIn={checkInDate} 
            checkOut={checkOutDate} 
            handleCheckInClick={handleCheckInClick} 
            handleCheckOutClick={handleCheckOutClick} 
            allowPast={true}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
           <div className="col-span-full text-center py-10 text-slate-400 animate-pulse">
             Loading rooms...
           </div>
        ) : (
          rooms?.map((room: RoomData) => {
            const style = getRoomStyle(room.currentOccupancy!);
            return (
              <div key={room.id} className={`bg-white p-5 rounded-xl border-l-4 ${style.border} shadow-sm hover:shadow-md transition-shadow`}>
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Floor {room.floor}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                    {style.label}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-800">Room {room.roomNumber}</h3>
                <div className="mt-4 flex items-center justify-between">
                  <p className={`text-sm font-semibold ${style.text}`}>
                    Occupancy: {room.currentOccupancy} / 2
                  </p>
                  <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${style.text.replace('text', 'bg')}`} 
                      style={{ width: `${(room.currentOccupancy! / 2) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AvailabilityDashboard;