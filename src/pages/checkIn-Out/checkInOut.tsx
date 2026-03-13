import {useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { 
  checkIn, 
  checkOut, 
  fetchBookingsByRange 
} from "@/app/asyncThunk/bookingThunk";
import PagingController from "@/components/common/paging/PagingController";
import DateRangePicker from "@/components/common/DateRangePicker/DateRangePicker"; 
import ManualBookingModal from "./manualBookingModel"; 
import toast from "react-hot-toast";
import dayjs from "dayjs";
import ConfirmationModel from "@/components/common/confirmationModel/confirmationModel";

const CheckInOutManagement = () => {
  const dispatch = useAppDispatch();
  const { bookings, loading , error } = useAppSelector((state) => state.booking);

  const [activeTab, setActiveTab] = useState<"checkin" | "checkout">("checkin");
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [ isConfirmationModelOpen , setConfirmationModel] = useState(false);
  const [bookingId , setBookingId] = useState<number | null>(null);
  
  const [dateRange, setDateRange] = useState({
    startDate: dayjs().startOf("month"),
    endDate: dayjs().endOf("month"),
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const loadBookings = () => {
    dispatch(
      fetchBookingsByRange({
        startDate: dateRange.startDate.format("YYYY-MM-DD"),
        endDate: dateRange.endDate.format("YYYY-MM-DD"),
      })
    ).unwrap().catch((err) => toast.error(err || "Failed to sync bookings"));
  }

  useEffect(() => {
    loadBookings();
  }, [dispatch, dateRange]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus = activeTab === "checkin" ? b.bookingStatus === 1 : b.bookingStatus === 2;
      
      const matchesUser = searchUser !== "" 
        ? (b.guestName?.toLowerCase().includes(searchUser.toLowerCase()))
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
      try {
        if (activeTab === "checkin") {
          await dispatch(checkIn(bookingId)).unwrap();
        } else {
          await dispatch(checkOut(bookingId)).unwrap();
        }
        toast.success(`${activeTab} successful`);
        loadBookings(); 
      } catch (error: any) {
        toast.error(error?.message || "Operation failed");
      }
      setBookingId(null);
      setConfirmationModel(false);
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (!date) return;
    if (!dateRange.startDate || (dateRange.startDate && dateRange.endDate)) {
      setDateRange({ startDate: date, endDate: date });
    } else {
      if (date.isBefore(dateRange.startDate)) {
        setDateRange({ startDate: date, endDate: dateRange.startDate });
      } else {
        setDateRange({ ...dateRange, endDate: date });
      }
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

  if(error) return <div>Error</div>

  return (
    <div className="p-4 md:p-8 min-h-screen w-full font-sans">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Front Desk Operations</h1>
          <p className="text-slate-500 text-sm">
            Current Period: <span className="font-bold text-slate-700">{dateRange.startDate.format("MMM DD")} — {dateRange.endDate.format("MMM DD")}</span>
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-200">
            <button 
              onClick={() => setActiveTab("checkin")} 
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === "checkin" ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-400 hover:bg-slate-50"}`}
            >
              Check-In List
            </button>
            <button 
              onClick={() => setActiveTab("checkout")} 
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${activeTab === "checkout" ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-400 hover:bg-slate-50"}`}
            >
              Check-Out List
            </button>
          </div>

          <button 
            onClick={() => setIsManualModalOpen(true)} 
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            + New Booking
          </button>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-8 flex flex-col lg:flex-row items-center gap-6">
        <div className="w-full lg:w-auto">
          <DateRangePicker 
            checkIn={dateRange.startDate} 
            checkOut={dateRange.endDate} 
            handleDateClick={handleDateChange} 
            allowPast={true}
          />
        </div>
        
        <div className="h-10 w-[1px] bg-slate-100 hidden lg:block" />

        <div className="flex flex-wrap gap-4 flex-grow w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search by Guest Name"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="flex-grow border border-slate-200 p-3 rounded-xl focus:ring-4 focus:ring-blue-50 outline-none text-sm transition-all bg-slate-50/30"
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

      {loading && bookings.length === 0 ? (
        <div className="py-32 text-center">
          <div className="inline-block animate-bounce mb-4 text-blue-600 font-black text-2xl">...</div>
          <p className="text-slate-400 font-medium tracking-wide">Retrieving records from database...</p>
        </div>
      ) : (
         <div className="md:block overflow-x-auto bg-white rounded-lg shadow-md mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
            <thead className="bg-gray-200 text-gray-600 border-b text-xs uppercase border-slate-100">
                <tr>
                  <th className="py-5 px-8">Guest Name</th>
                  <th className="py-5 px-8">Room</th>
                  <th className="py-5 px-8">Stay Period</th>
                  <th className="py-5 px-8">Status</th>
                  <th className="py-5 px-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {currentItems.length > 0 ? currentItems.map((b) => (
                  <tr key={b.bookinId} className="hover:bg-blue-50/20 transition-colors group">
                    <td className="py-5 px-8">
                      <div className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{b.userName}</div>
                    </td>
                    <td className="py-5 px-8">
                        Room {b.roomNumber}
                    </td>
                    <td className="py-5 px-8 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-2">
                         <span>{dayjs(b.checkInDate).format("DD MMM")}</span>
                         <span className="text-slate-300">→</span>
                         <span>{dayjs(b.checkOutDate).format("DD MMM")}</span>
                      </div>
                    </td>
                    <td className="py-5 px-8">{getStatusBadge(b.bookingStatus)}</td>
                    <td className="py-5 px-8 text-right">
                      <button 
                        onClick={() => {
                          setBookingId(b.bookingId)
                          setConfirmationModel(true);
                        }} 
                        className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-white transition-all shadow-md active:scale-95 ${activeTab === 'checkin' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-100'}`}
                      >
                        Confirm {activeTab === 'checkin' ? 'Arrival' : 'Departure'}
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="py-32 text-center">
                      <div className="text-slate-300 italic text-sm mb-1">No bookings match these filters.</div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Try adjusting the date range or search terms.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-center mt-10">
        <PagingController 
          dataLength={filteredBookings.length} 
          itemPerPage={itemsPerPage} 
          currentPage={currentPage} 
          goToPrevious={() => setCurrentPage(p => Math.max(1, p - 1))} 
          goToNext={() => setCurrentPage(p => p + 1)} 
          goToSpecificPage={setCurrentPage} 
        />
      </div>

      {isManualModalOpen && (
        <ManualBookingModal 
          closeModel={() => { 
            setIsManualModalOpen(false); 
            loadBookings(); 
          }} 
        />
      )}
      {isConfirmationModelOpen && <ConfirmationModel 
            label={`Are you sure you want to process ${activeTab} for bookingId ${bookingId}?` }
            isConfirmationModelOpen={setConfirmationModel} 
            actionText={activeTab}
            submitAction={handleAction}
            classname={activeTab === "checkin" ? "bg-emerald-500! hover:bg-emerald-600! shadow-emerald-100!" : 'bg-orange-500! hover:bg-orange-600! shadow-orange-100!'}/>}
    </div>
  );
};

export default CheckInOutManagement;