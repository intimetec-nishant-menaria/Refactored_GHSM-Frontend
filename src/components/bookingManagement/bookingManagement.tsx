import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchAllBookings, cancelBooking } from "@/app/asyncThunk/bookingThunk";
import PagingController from "../common/paging/PagingController";
import Button from "../common/button/Button";
import toast from "react-hot-toast";

const BookingManagement = () => {
  const dispatch = useAppDispatch();
  const { bookings, loading, error } = useAppSelector((state) => state.booking);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Filter State
  const [searchUser, setSearchUser] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(0);

  // 1. Pagination Functions
  const goToNextPage = () => {
    if (currentPage < Math.ceil(filteredBookings.length / itemsPerPage)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToSpecificPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // 2. Filter Logic
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesUser = !searchUser || b.userEmail.toLowerCase().includes(searchUser.toLowerCase());
      const matchesRoom = !roomFilter || b.roomNumber.toString().includes(roomFilter);
      const matchesStatus = statusFilter === 0 || b.status === statusFilter;

      return matchesUser && matchesRoom && matchesStatus;
    });
  }, [bookings, searchUser, roomFilter, statusFilter]);

  // 3. Reset to page 1 when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchUser, roomFilter, statusFilter]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = useMemo(() => filteredBookings.slice(startIndex, endIndex), [filteredBookings, startIndex, endIndex]);

  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);

  const handleCancel = (bookingId: number, checkInDate: string) => {
      if (window.confirm("Are you sure you want to cancel this booking?")) {
        dispatch(cancelBooking(bookingId)).then(() => {
          toast.success("Booking cancelled successfully.");
          dispatch(fetchAllBookings());
        })
        .catch((error: any) => {
          toast.error(error?.message || "Failed to cancel booking.");
        });
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
    const label = labels[status as keyof typeof labels] || "Unknown";
    const style = styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700";

    return <span className={`px-2 py-1 rounded text-xs font-bold ${style}`}>{label}</span>;
  };

  if (loading) return <p className="p-6 text-center text-blue-600 font-medium">Loading bookings...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen w-full">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">Booking Management</h1>
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <input
            type="text"
            placeholder="Search by user email..."
            value={searchUser}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchUser(e.target.value)}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500 flex-grow sm:w-64 outline-none bg-white shadow-sm"
          />
          <input
            type="text"
            placeholder="Room #"
            value={roomFilter}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setRoomFilter(e.target.value)}
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500 w-full sm:w-32 outline-none bg-white shadow-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatusFilter(Number(e.target.value))}
          className="border p-2 rounded focus:ring-2 focus:ring-blue-500 bg-white outline-none w-full lg:w-48 shadow-sm"
        >
          <option value={0}>All Status</option>
          <option value={1}>Booked</option>
          <option value={2}>Checked In</option>
          <option value={3}>Cancelled</option>
        </select>
      </div>
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {currentItems.length > 0 ? (
          currentItems.map((b) => (
            <div key={b.bookingId} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div className="max-w-[70%]">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">ID: #{b.bookingId}</span>
                  <p className="font-semibold text-gray-800 break-all text-sm leading-tight">{b.userEmail}</p>
                </div>
                {getStatusBadge(b.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-gray-50 my-2">
                <div>
                  <p className="text-gray-400 uppercase font-bold text-[9px]">Room Number</p>
                  <p className="font-medium text-gray-700">{b.roomNumber}</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase font-bold text-[9px]">Duration</p>
                  <p className="text-gray-700">
                    {new Date(b.checkInDate).toLocaleDateString()} - {new Date(b.checkOutDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {b.status === 1 && new Date(b.checkInDate) > new Date() && (
                <Button
                  label="Cancel Booking"
                  onClick={() => handleCancel(b.bookingId, b.checkInDate)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-bold text-sm transition-colors mt-2"
                />
              )}
            </div>
          ))
        ) : (
          <div className="bg-white p-8 text-center rounded-lg text-gray-400">No bookings found matching your filters.</div>
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
                <tr key={b.bookingId} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-gray-500 font-mono text-sm">#{b.bookingId}</td>
                  <td className="py-4 px-4 font-medium text-gray-800">{b.userEmail}</td>
                  <td className="py-4 px-4">{b.roomNumber}</td>
                  <td className="py-4 px-4 text-sm">{new Date(b.checkInDate).toLocaleDateString()}</td>
                  <td className="py-4 px-4 text-sm">{new Date(b.checkOutDate).toLocaleDateString()}</td>
                  <td className="py-4 px-4">{getStatusBadge(b.status)}</td>
                  <td className="py-4 px-4 text-center">
                    {b.status == 1 /*&& new Date(b.checkInDate) > new Date()*/ ? (
                      <Button
                        label="Cancel"
                        onClick={() => handleCancel(b.bookingId, b.checkInDate)}
                        className="bg-red-500 hover:bg-red-600 hover:text-white text-red-600 px-4 py-1 rounded-full transition-all text-xs font-bold border border-red-200"
                      />
                    ) : (
                      <span className="text-gray-300 text-xs italic">N/A</span>
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
      <div className="mt-4 flex justify-center md:justify-end">
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

export default BookingManagement;