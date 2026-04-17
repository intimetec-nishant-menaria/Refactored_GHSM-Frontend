import { useEffect, useMemo, useState } from "react";
import PagingController from "@/components/common/paging/PagingController";
import DateRangePicker from "@/components/common/DateRangePicker"; 
import toast from "react-hot-toast";
import dayjs, { Dayjs } from "dayjs";
import ConfirmationModel from "@/components/common/confirmationModel/confirmationModel";
import { useCheckInMutation, useCheckOutMutation, useFetchBookingByRangeQuery } from "@/app/Api/booking";
import { useAppSelector } from "@/hooks/useAppSelector";

interface DateRangeState {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

const CheckInOutManagement = () => {
  const { user } = useAppSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState<"checkin" | "checkout">("checkin");
  const [searchUser, setSearchUser] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [isConfirmationModelOpen, setConfirmationModel] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  
  const [dateRange, setDateRange] = useState<DateRangeState>({
    startDate: dayjs().startOf("month"),
    endDate: dayjs().endOf("month"),
  });

  const { data: bookings, isLoading, isError } = useFetchBookingByRangeQuery({
    startDate: dateRange.startDate?.format("YYYY-MM-DD") ?? "",
    endDate: dateRange.endDate?.format("YYYY-MM-DD") ?? "",
  },{
    skip : !dateRange.startDate || !dateRange.endDate,
    refetchOnFocus : true,
  });
  
  const [checkIn] = useCheckInMutation();
  const [checkOut] = useCheckOutMutation();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const filteredBookings = useMemo(() => {
    if (!bookings) return [];
    return bookings.filter((b) => {
      const matchesStatus = activeTab === "checkin" ? b.status === 1 : b.status === 2;
      const matchesUser = searchUser !== "" 
        ? b.guestName?.toLowerCase().includes(searchUser.toLowerCase())
        : true;
      const matchesRoom = roomFilter !== "" 
        ? b.roomNumber.toString().includes(roomFilter) 
        : true;
      return matchesStatus && matchesUser && matchesRoom;
    });
  }, [bookings, activeTab, searchUser, roomFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchUser, roomFilter, activeTab, dateRange]);

  const currentItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(start, start + itemsPerPage);
  }, [filteredBookings, currentPage, itemsPerPage]);

  const handleAction = async () => {
    if (!bookingId) return;
    try {
      if (activeTab === "checkin") {
            await checkIn(bookingId).unwrap();
      } else {
        await checkOut(bookingId).unwrap();
      }
      toast.success(`${activeTab === 'checkin' ? 'Check-In' : 'Check-Out'} successful`);
    } catch (error: any) {
      toast.error(error?.data?.message || "Operation failed");
    }
    setBookingId(null);
    setConfirmationModel(false);
  };

  const handleDateChange = (type: 'start' | 'end', newDate: Dayjs | null) => {
    if(!newDate) return;
    setDateRange(prev => ({
        ...prev,
        [type === 'start' ? 'startDate' : 'endDate']: newDate
    }));
  };

  const getStatusBadge = (status: number) => {
    const styles: Record<number, string> = {
      1: "bg-primary/10 text-primary border-primary/20",
      2: "bg-success/10 text-success border-success/20",
      3: "bg-muted text-text-muted border-border",
      4: "bg-danger/10 text-danger border-danger/20",
    };
    const labels: Record<number, string> = { 1: "Booked", 2: "In House", 3: "Completed", 4: "Cancelled" };
    return (
      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (isError) return <div className="p-8 text-danger font-black bg-layout min-h-screen">Error loading bookings. Please try again.</div>;

  return (
    <div className="p-4 md:p-8 min-h-screen w-full font-sans bg-layout">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6">
        <div>
          <h1 className="text-2xl font-black text-text-main tracking-tight uppercase">Front Desk Operations</h1>
          <p className="text-text-muted text-sm font-medium">
            Manage arrivals and departures for <span className="font-black text-text-main underline decoration-primary/30">{dateRange.startDate?.format("MMM DD")} — {dateRange.endDate?.format("MMM DD")}</span>
          </p>
        </div>
        
        <div className="flex bg-surface p-1.5 rounded-2xl shadow-sm border border-border">
          <button 
            onClick={() => setActiveTab("checkin")} 
            className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "checkin" ? "bg-primary text-surface shadow-lg shadow-primary/20" : "text-text-muted hover:bg-layout"}`}
          >
            Arrivals
          </button>
          <button 
            onClick={() => setActiveTab("checkout")} 
            className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === "checkout" ? "bg-primary text-surface shadow-lg shadow-primary/20" : "text-text-muted hover:bg-layout"}`}
          >
            Departures
          </button>
        </div>
      </div>
      {user?.role !== "Guard" && (
        <div className="bg-surface p-6 rounded-3xl shadow-sm border border-border mb-8 flex flex-col lg:flex-row items-center gap-6">
          <DateRangePicker 
            checkIn={dateRange.startDate} 
            checkOut={dateRange.endDate} 
            handleCheckInClick={(d) => handleDateChange('start', d)}
            handleCheckOutClick={(d) => handleDateChange('end', d)}
            allowPast={true}
          />
        <div className="h-10 w-px bg-border hidden lg:block" />
        <div className="flex flex-wrap gap-4 flex-1 w-full">
            <input
              type="text"
              placeholder="Filter by Guest Name..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="flex-1 border border-border p-3 rounded-xl focus:ring-4 focus:ring-primary/5 outline-none text-sm font-bold transition-all bg-layout/30 text-text-main"
            />
            <input
              type="text"
              placeholder="Room #"
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="w-28 border border-border p-3 rounded-xl focus:ring-4 focus:ring-primary/5 outline-none text-sm transition-all text-center font-black bg-layout/30 text-text-main"
            />
          </div>
        </div>
      )}
      <div className="overflow-hidden bg-surface rounded-3xl border border-border shadow-sm mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left table-auto">
            <thead className="bg-muted text-text-muted border-b border-border text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="py-5 px-8">Guest Identity</th>
                <th className="py-5 px-8">Unit</th>
                <th className="py-5 px-8">Arrival</th>
                <th className="py-5 px-8">Departure</th>
                <th className="py-5 px-8">Status</th>
                <th className="py-5 px-8 text-right">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted">
              {isLoading ? (
                <tr>
                   <td colSpan={6} className="py-20 text-center text-primary font-black animate-pulse uppercase tracking-widest text-xs">Synchronizing Records...</td>
                </tr>
              ) : currentItems.length > 0 ? currentItems.map((b) => (
                <tr key={b.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="py-5 px-8 font-bold text-text-main text-sm">{b.guestName}</td>
                  <td className="py-5 px-8 font-black text-text-muted text-xs uppercase tracking-tighter">Room {b.roomNumber}</td>
                  <td className="py-5 px-8">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-text-main">{dayjs(b.checkInDate).format("DD MMM YYYY")}</span>
                      <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Scheduled</span>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-text-main">{dayjs(b.checkOutDate).format("DD MMM YYYY")}</span>
                      <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider">Scheduled</span>
                    </div>
                  </td>
                  <td className="py-5 px-8">{getStatusBadge(b.status)}</td>
                  <td className="py-5 px-8 text-right">
                    <button 
                      onClick={() => { setBookingId(b.id); setConfirmationModel(true); }} 
                      className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg transition-all active:scale-95 ${activeTab === 'checkin' ? 'bg-success hover:bg-success-hover shadow-success/20' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'}`}
                    >
                      Confirm {activeTab}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-text-muted italic font-medium text-sm">No pending {activeTab} operations found for this range.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center mt-10">
        {filteredBookings.length !== 0 && (
          <PagingController 
            dataLength={filteredBookings.length} 
            itemPerPage={itemsPerPage} 
            currentPage={currentPage} 
            goToPrevious={() => setCurrentPage(p => Math.max(1, p - 1))} 
            goToNext={() => setCurrentPage(p => p + 1)} 
            goToSpecificPage={setCurrentPage} 
          />
        )}  
      </div>
      {isConfirmationModelOpen && (
        <ConfirmationModel 
          label={`Are you ready to process the ${activeTab === 'checkin' ? 'Arrival' : 'Departure'} for ${filteredBookings.find(b => b.id === bookingId)?.guestName}?`}
          isConfirmationModelOpen={setConfirmationModel} 
          actionText={activeTab === 'checkin' ? 'Check-In' : 'Check-Out'}
          submitAction={handleAction}
          classname={activeTab === "checkin" ? "bg-success! hover:bg-success-hover! shadow-success/20!" : 'bg-orange-500! hover:bg-orange-600! shadow-orange-500/20!'}
        />
      )}
    </div>
  );
};

export default CheckInOutManagement;