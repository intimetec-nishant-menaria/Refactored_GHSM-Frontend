import { useEffect, useState, type ChangeEvent } from "react";
import PagingController from "@/components/common/paging/PagingController";
import dayjs from "dayjs";
import Button from "@/components/common/button/Button";
import ConfirmationModel from "@/components/common/confirmationModel/confirmationModel";
import toast from "react-hot-toast";
import { useCancelBookingMutation, useFetchUserBookingsQuery } from "@/app/Api's/booking";

const MyBookings = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingId , setBookingId] = useState<number | null>(null);
  const [isConfirmationModelOpen , setConfirmationModel] = useState(false);
  const [pageSize] = useState(2);

  const [roomFilter, setRoomFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState(0);

  const { data:bookings , isLoading , isError , error } = useFetchUserBookingsQuery({
    currentPage,
    pageSize,
    roomFilter,
    statusFilter
  });

  const [cancelBooking] = useCancelBookingMutation();

  const goToNextPage = () => {
    if(bookings?.metaData.hasNext){
        setCurrentPage(currentPage+1);
    }
  };

  const goToPrevPage = () => {
    if(bookings?.metaData.hasPrev){
        setCurrentPage(currentPage-1);
    }
  };

  const goToSpecificPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [roomFilter, statusFilter]);


   const handleCancel = async () => {
    if(!bookingId) return;

      await cancelBooking(bookingId)
        .then(() => {
          toast.success("Booking cancelled successfully.");
        })
        .catch((error: any) => {
          toast.error(error?.data.message || "Failed to cancel booking.");
        });

      setBookingId(null);
      setConfirmationModel(false);
  };

  const getStatusBadge = (status: number) => {
    const labels = {
      1: "Booked",
      2: "Checked In",
      3: "Completed",
      4: "Cancelled",
    };
    const styles = {
      1: "bg-blue-100 text-blue-700 border border-blue-200",
      2: "bg-emerald-100 text-emerald-700 border border-emerald-200",
      3: "bg-slate-100 text-slate-600 border border-slate-200",
      4: "bg-red-100 text-red-700 border border-red-200",
    };
    const label = labels[status as keyof typeof labels] || "Unknown";
    const style =
      styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700";

    return (
      <span className={`px-2 py-1 rounded text-xs font-bold ${style}`}>
        {label}
      </span>
    );
  };

  if (isLoading)
    return (
      <p className="p-6 text-center text-blue-600 font-medium">
        Loading bookings...
      </p>
    );
  if (isError) return <p className="p-6 text-center text-red-500">{error as string}</p>;

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen w-full">
      <h1 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">
        Booking Management
      </h1>
      <div className="bg-white rounded-2xl p-4 flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <input
            type="text"
            placeholder="Room #"
            value={roomFilter}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setRoomFilter(e.target.value)
            }
            className="border p-2 rounded focus:ring-2 focus:ring-blue-500 w-full sm:w-32 outline-none bg-white shadow-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setStatusFilter(Number(e.target.value))
          }
          className="border p-2 rounded focus:ring-2 focus:ring-blue-500 bg-white outline-none w-full lg:w-48 shadow-sm"
        >
          <option value={0}>All Status</option>
          <option value={1}>Booked</option>
          <option value={2}>Checked In</option>
          <option value={3}>Completed</option>
          <option value={4}>Cancelled</option>
        </select>
      </div>
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {bookings?.data.length ?? 0 > 0 ? (
          bookings?.data.map((b) => (
            <div key={b.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <div className="max-w-[70%]">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">ID: #{b.id}</span>
                  <p className="text-sm leading-tight break-all">
                    <span className="font-semibold text-gray-800">{b.guestName}</span>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="text-gray-500 text-xs">{b.guestEmail}</span>
                  </p>
                </div>
                {getStatusBadge(b.status)}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-gray-50 my-2">
                <div>
                  <p className="text-gray-400 uppercase font-bold text-[9px]">
                    Room Number
                  </p>
                  <p className="font-medium text-gray-700">{b.roomNumber}</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase font-bold text-[9px]">
                    Duration
                  </p>
                  <p className="text-gray-700">
                    {new Date(b.checkInDate).toLocaleDateString()} -{" "}
                    {new Date(b.checkOutDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-8 text-center rounded-lg text-gray-400">
            No bookings found matching your filters.
          </div>
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
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {bookings?.data.length ?? 0 > 0 ? (
              bookings?.data.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 text-gray-500 font-mono text-sm">#{b.id}</td>
                  <td className="py-4 px-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-gray-800 leading-tight">
                        {b.guestName}
                      </span>
                      <span className="text-xs text-gray-500 font-normal break-all">
                        {b.guestEmail}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">{b.roomNumber}</td>
                  <td className="py-4 px-4 text-sm">
                    {dayjs(b.checkInDate).format("DD/MM/YYYY")}
                  </td>
                  <td className="py-4 px-4 text-sm">
                    {dayjs(b.checkOutDate).format("DD/MM/YYYY")}
                  </td>
                  <td className="py-4 px-4">{getStatusBadge(b.status)}</td>
                  <td className="py-4 px-4 text-center">
                    {b.status == 1 
                    /*&& new Date(b.checkInDate) > new Date()*/ ? (
                      <Button
                        label="Cancel"
                        onClick={() => {
                          setBookingId(b.id);
                          setConfirmationModel(true);
                        }}
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
                <td colSpan={7} className="py-10 text-center text-gray-400">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-center md:justify-end">
        <PagingController
          dataLength={bookings?.metaData.totalCount ?? 0}
          itemPerPage={pageSize}
          currentPage={currentPage}
          goToPrevious={goToPrevPage}
          goToNext={goToNextPage}
          goToSpecificPage={goToSpecificPage}
        />
      </div>
      {isConfirmationModelOpen &&
        <ConfirmationModel label="Are you sure you want to cancel this booking?" isConfirmationModelOpen={()=>setConfirmationModel(false)}
          submitAction={handleCancel}
        />}
    </div>
  );
};

export default MyBookings;