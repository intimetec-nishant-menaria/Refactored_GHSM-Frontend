import { useEffect, useMemo, useState } from "react";
import PagingController from "@/components/common/paging/PagingController";
import DateRangePicker from "@/components/common/DateRangePicker/DateRangePicker"; 
import toast from "react-hot-toast";
import dayjs from "dayjs";
import ConfirmationModel from "@/components/common/confirmationModel/confirmationModel";
import { useCheckInMutation, useCheckOutMutation, useFetchBookingByRangeQuery } from "@/app/Api's/booking";
import { useAppSelector } from "@/hooks/useAppSelector";

const CheckInOutManagement = () => {
  const { user } = useAppSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState<"checkin" | "checkout">("checkin");
  const [searchUser, setSearchUser] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [isConfirmationModelOpen, setConfirmationModel] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  
  const [dateRange, setDateRange] = useState({
    startDate: dayjs().startOf("month"),
    endDate: dayjs().endOf("month"),
  });

  const { data: bookings, isLoading, isError } = useFetchBookingByRangeQuery({
    startDate: dateRange.startDate.format("YYYY-MM-DD"),
    endDate: dateRange.endDate.format("YYYY-MM-DD"),
  },{
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

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (!date) return;
    if (date.isBefore(dateRange.startDate)) {
      setDateRange({ startDate: date, endDate: dateRange.endDate });
    } else {
      setDateRange({ startDate: dateRange.startDate, endDate: date });
    }
  };

  const getStatusBadge = (status: number) => {
    const styles: Record<number, string> = {
      1: "bg-blue-50 text-blue-600 border-blue-100",
      2: "bg-emerald-50 text-emerald-600 border-emerald-100",
      3: "bg-slate-50 text-slate-500 border-slate-100",
      4: "bg-red-50 text-red-600 border-red-100",
    };
    const labels: Record<number, string> = { 1: "Booked", 2: "In House", 3: "Completed", 4: "Cancelled" };
    return (
      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (isError) return <div className="p-8 text-red-500 font-bold">Error loading bookings. Please try again.</div>;

  return (
    <div className="p-4 md:p-8 min-h-screen w-full font-sans ">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Front Desk Operations</h1>
          <p className="text-slate-500 text-sm">
            Manage arrivals and departures for <span className="font-bold text-slate-700">{dateRange.startDate.format("MMM DD")} — {dateRange.endDate.format("MMM DD")}</span>
          </p>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
          <button 
            onClick={() => setActiveTab("checkin")} 
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === "checkin" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-400 hover:bg-slate-50"}`}
          >
            Check-In 
          </button>
          <button 
            onClick={() => setActiveTab("checkout")} 
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === "checkout" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-400 hover:bg-slate-50"}`}
          >
            Check-Out 
          </button>
        </div>
      </div>
      {user?.role !== "Guard" && (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-8 flex flex-col lg:flex-row items-center gap-6">
          <DateRangePicker 
            checkIn={dateRange.startDate} 
            checkOut={dateRange.endDate} 
            handleDateClick={handleDateChange} 
            allowPast={true}
          />
        <div className="h-10 bg-slate-100 hidden lg:block" />
        <div className="flex flex-wrap gap-4 flex-1 w-full">
            <input
              type="text"
              placeholder="Search by Guest Name"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              className="flex-1 border border-slate-200 p-3 rounded-xl focus:ring-4 focus:ring-blue-50 outline-none text-sm transition-all bg-slate-50/30"
            />
            <input
              type="text"
              placeholder="Room #"
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="w-28 border border-slate-200 p-3 rounded-xl focus:ring-4 focus:ring-blue-50 outline-none text-sm transition-all text-center font-bold"
            />
          </div>
        </div>
      )}
      <div className="overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-sm mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50 text-slate-500 border-b text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="py-5 px-8">Guest</th>
                <th className="py-5 px-8">Room</th>
                <th className="py-5 px-8">Check-In Date</th>
                <th className="py-5 px-8">Check-Out Date</th>
                <th className="py-5 px-8">Status</th>
                <th className="py-5 px-8 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                   <td colSpan={6} className="py-20 text-center text-blue-600 font-bold animate-pulse">Loading Records...</td>
                </tr>
              ) : currentItems.length > 0 ? currentItems.map((b) => (
                <tr key={b.id} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="py-5 px-8 font-semibold text-slate-800">{b.guestName}</td>
                  <td className="py-5 px-8 font-medium text-slate-600">Room {b.roomNumber}</td>
                  <td className="py-5 px-8">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{dayjs(b.checkInDate).format("DD MMM YYYY")}</span>
                      <span className="text-[10px] text-slate-400">Scheduled Arrival</span>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-700">{dayjs(b.checkOutDate).format("DD MMM YYYY")}</span>
                      <span className="text-[10px] text-slate-400">Scheduled Departure</span>
                    </div>
                  </td>
                  <td className="py-5 px-8">{getStatusBadge(b.status)}</td>
                  <td className="py-5 px-8 text-right">
                    <button 
                      onClick={() => { setBookingId(b.id); setConfirmationModel(true); }} 
                      className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-white shadow-md transition-all active:scale-95 ${activeTab === 'checkin' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-100'}`}
                    >
                      Confirm {activeTab}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-slate-400 italic">No pending {activeTab}s found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center mt-10">
        {filteredBookings.length !==0  && (
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
          label={`Confirm ${activeTab} for ${filteredBookings.find(b => b.id === bookingId)?.guestName}?`}
          isConfirmationModelOpen={setConfirmationModel} 
          actionText={activeTab }
          submitAction={handleAction}
          classname={activeTab === "checkin" ? "bg-emerald-500! hover:bg-emerald-600! shadow-emerald-100!" : 'bg-orange-500! hover:bg-orange-600! shadow-orange-100!'}
        />
      )}
    </div>
  );
};

export default CheckInOutManagement;