import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { checkIn, checkOut, fetchBookingsByRange, updateBooking } from "@/app/asyncThunk/bookingThunk";
import PagingController from "@/components/common/paging/PagingController";
import Button from "@/components/common/button/Button";
import toast from "react-hot-toast";
import type { BookingPayload } from "@/utils/interfaces/booking";
import dayjs from "dayjs";

const CheckInOutManagement = () => {
  const dispatch = useAppDispatch();
  const { bookings, loading, error } = useAppSelector((state) => state.booking);

  const [activeTab, setActiveTab] = useState<"checkin" | "checkout">("checkin");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [searchUser, setSearchUser] = useState("");
  const [roomFilter, setRoomFilter] = useState("");

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesStatus = activeTab === "checkin" ? b.status === 1 : b.status === 2;
      const matchesUser = !searchUser || b.userEmail.toLowerCase().includes(searchUser.toLowerCase());
      const matchesRoom = !roomFilter || b.roomNumber.toString().includes(roomFilter);

      return matchesStatus && matchesUser && matchesRoom;
    });
  }, [bookings, activeTab, searchUser, roomFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchUser, roomFilter, activeTab]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = useMemo(() => filteredBookings.slice(startIndex, endIndex), [filteredBookings, startIndex, endIndex]);

  useEffect(() => {
    dispatch(fetchBookingsByRange({startDate : dayjs().startOf('day').toISOString() , endDate :  dayjs().endOf('day').toISOString() }));
  }, [dispatch]);

  const handleAction = async (booking : BookingPayload) => {
    console.log(booking);
    const actionText = activeTab === "checkin" ? "Check-In" : "Check-Out";
    if (window.confirm(`Are you sure you want to process ${actionText} for this booking?`)) {
        if(activeTab === "checkin"){
            try{
                await dispatch(checkIn(booking.id)).unwrap();
                toast.success(`${actionText} successful`);
            }catch(error :any){
                toast.error(error?.message || `${actionText} failed.`);
            }
        }else{
            try{          
                await dispatch(checkOut(booking.id)).unwrap();
                toast.success(`${actionText} successful`);
            }catch(error:any){
                toast.error(error?.message || `${actionText} failed.`);
            }
        }
        await dispatch(fetchBookingsByRange({startDate : dayjs().startOf('day').toISOString() , endDate :  dayjs().endOf('day').toISOString() }));
    }
  };

  const getStatusBadge = (status: number) => {
    const labels = { 1: "Booked", 2: "Checked In", 3: "Completed", 4: "Cancelled" };
    const styles = {
      1: "bg-blue-100 text-blue-700 border border-blue-200",
      2: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      3: "bg-slate-100 text-slate-600 border border-slate-200",
      4: "bg-red-100 text-red-700 border border-red-200",
    };
    return <span className={`px-2 py-1 rounded text-[10px] font-bold ${styles[status as keyof typeof styles] || "bg-gray-100"}`}>{labels[status as keyof typeof labels] || "Unknown"}</span>;
  };
  
  const goToNextPage = () => setCurrentPage(prev => prev + 1);
  const goToPrevPage = () => setCurrentPage(prev => prev - 1);
  const goToSpecificPage = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) return <p className="p-6 text-center text-blue-600 font-medium animate-pulse">Loading operations...</p>;

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">Front Desk Operations</h1>
        
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-200 w-full md:w-auto">
          <button
            onClick={() => setActiveTab("checkin")}
            className={`flex-1 md:w-32 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "checkin" ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Check-In
          </button>
          <button
            onClick={() => setActiveTab("checkout")}
            className={`flex-1 md:w-32 py-2 rounded-lg text-sm font-bold transition-all ${
              activeTab === "checkout" ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Check-Out
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search guest email..."
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none flex-grow md:max-w-xs text-sm"
        />
        <input
          type="text"
          placeholder="Room #"
          value={roomFilter}
          onChange={(e) => setRoomFilter(e.target.value)}
          className="border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 w-24 outline-none text-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {currentItems.length > 0 ? (
          currentItems.map((b) => (
            <div key={b.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Room {b.roomNumber}</span>
                {getStatusBadge(b.status)}
              </div>
              <h3 className="font-bold text-gray-800 break-all mb-1">{b.guestEmail}</h3>
              <p className="text-xs text-gray-500 mb-4 italic">
                {new Date(b.checkInDate).toLocaleDateString()} - {new Date(b.checkOutDate).toLocaleDateString()}
              </p>
              
              <Button
                label={activeTab === "checkin" ? "Confirm Check-In" : "Process Check-Out"}
                onClick={() => handleAction(b)}
                className={`w-full py-2.5 rounded-xl font-bold text-white transition-all ${
                  activeTab === "checkin" ? "bg-emerald-500 hover:bg-emerald-600" : "bg-amber-500 hover:bg-amber-600"
                }`}
              />
            </div>
          ))
        ) : (
          <div className="bg-white p-10 text-center rounded-2xl text-gray-400 italic">No pending {activeTab}s.</div>
        )}
      </div>

       <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md mb-6">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-200 text-gray-600 uppercase text-xs">
            <tr>
              <th className="py-3 px-4">Booking ID</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Room Number</th>
              <th className="py-3 px-4">Check In</th>
              <th className="py-3 px-4">Check Out</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentItems.length > 0 ? (
              currentItems.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-gray-500 font-mono text-sm">#{b.id}</td>
                  <td className="py-4 px-4 font-medium text-gray-800">{b.guestEmail}</td>
                  <td className="py-4 px-4">{b.roomNumber}</td>
                  <td className="py-4 px-4 text-sm">{new Date(b.checkInDate).toLocaleDateString()}</td>
                  <td className="py-4 px-4 text-sm">{new Date(b.checkOutDate).toLocaleDateString()}</td>
                  <td className="py-4 px-4">{getStatusBadge(b.status)}</td>
                  <td className="py-4 px-4 text-center">
                    {b.status == 1 /*&& new Date(b.checkInDate) > new Date()*/ ? (
                      <Button
                        label="Check-In"
                        onClick={() => handleAction(b)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-full transition-all text-[11px] font-black uppercase tracking-wider shadow-sm"
                        />
                    ) : (
                        <Button
                            label="Check-Out"
                            onClick={() => handleAction(b)}
                            className="bg-green-500 hover:bg-amber-600 text-white px-4 py-1.5 rounded-full transition-all text-[11px] font-black uppercase tracking-wider shadow-sm"
                        />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-10 text-center text-gray-400">No bookings found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex justify-center">
        <PagingController
          dataLength={filteredBookings.length}
          itemPerPage={itemsPerPage}
          currentPage={currentPage}
          goToPrevious={goToPrevPage}
          goToNext={goToNextPage}
          goToSpecificPage={goToSpecificPage}
        />
      </div>
    </div>
  );
};

export default CheckInOutManagement;