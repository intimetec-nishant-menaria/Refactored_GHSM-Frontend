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
      return { 
        border: 'border-success', 
        text: 'text-success', 
        bg: 'bg-success/10', 
        label: 'Fully Available' 
      };
    }
    return { 
      border: 'border-amber-500', 
      text: 'text-amber-600', 
      bg: 'bg-amber-50', 
      label: 'Partially Available' 
    };
  };

  return (
    <div className="p-4 md:p-8 min-h-screen bg-layout font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-text-main tracking-tight uppercase">Room Availability</h1>
        <p className="text-text-muted text-sm font-medium">Real-time status of guest house inventory</p>
      </div>
      <div className="mb-8 p-4 bg-surface rounded-2xl shadow-sm border border-border inline-flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3 px-2 border-r border-border pr-6">
          <span className="text-primary text-xl">📅</span>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase mb-4 text-text-muted tracking-widest">Select Range</span>
            <DateRangePicker 
              checkIn={checkInDate} 
              checkOut={checkOutDate} 
              handleCheckInClick={handleCheckInClick} 
              handleCheckOutClick={handleCheckOutClick} 
              allowPast={true}
            />
          </div>
        </div>
        <div className="flex gap-4">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success shadow-sm" />
                <span className="text-[10px] font-bold text-text-muted uppercase">Empty</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm" />
                <span className="text-[10px] font-bold text-text-muted uppercase">Shared</span>
            </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {isLoading ? (
           <div className="col-span-full text-center py-20 bg-surface rounded-3xl border border-border/50">
             <div className="animate-pulse text-primary font-black uppercase tracking-widest text-xs">
                Analyzing Room Occupancy...
             </div>
           </div>
        ) : (
          rooms?.map((room: RoomData) => {
            const style = getRoomStyle(room.currentOccupancy!);
            return (
              <div 
                key={room.id} 
                className={`bg-surface p-5 rounded-3xl border-l-8 ${style.border} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Floor {room.floor}</p>
                  <span className={`text-[9px] font-black px-2.5 py-1 rounded-full border border-current/20 ${style.bg} ${style.text} uppercase tracking-tighter`}>
                    {style.label}
                  </span>
                </div>
                
                <h3 className="text-xl font-black text-text-main group-hover:text-primary transition-colors">
                    Room {room.roomNumber}
                </h3>
                
                <div className="mt-6 flex flex-col gap-2">
                  <div className="flex justify-between items-end">
                    <p className={`text-[10px] font-black uppercase tracking-wider ${style.text}`}>
                      Occupancy: {room.currentOccupancy} / 2
                    </p>
                    <span className="text-[10px] font-bold text-text-muted">{ (room.currentOccupancy! / 2) * 100}%</span>
                  </div>
                  
                  <div className="h-2 w-full bg-layout rounded-full overflow-hidden border border-border/30">
                    <div 
                      className={`h-full transition-all duration-500 ease-out ${style.text.replace('text', 'bg')}`} 
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