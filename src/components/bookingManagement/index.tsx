import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import PagingController from "../common/paging/PagingController";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import ConfirmationModel from "../common/confirmationModel/confirmationModel";
import Modal from "../common/modal/index.tsx";
import UpdateBookingForm from "./updateBookingForm"; 
import AddBookingForm from "./addBookingForm/index.tsx"; 
import editIcon from "@/assets/editIcon.png";
import { useCancelBookingMutation, useFetchAllBookingsQuery } from "@/app/Api/booking.ts";
import type { BookingPayload } from "@/utils/interfaces/booking";

const BookingManagement = () => {
  const navigate = useNavigate(); 
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [searchUser, setSearchUser] = useState("");
  const [roomFilter, setRoomFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<number>(0);
  const [isConfirmationModelOpen, setConfirmationModel] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [debounceSearch, setDebounceSearch] = useState("");
  const [editingBooking, setEditingBooking] = useState<BookingPayload | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [cancelBooking] = useCancelBookingMutation();
  const { data: bookings, isLoading } = useFetchAllBookingsQuery({
    currentPage,
    pageSize,
    searchUser: debounceSearch,
    roomFilter,
    statusFilter
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchUser, roomFilter, statusFilter]);

  useEffect(() => {
    let id = setTimeout(() => {
      setDebounceSearch(searchUser);
    }, 500);
    return () => clearTimeout(id);
  }, [searchUser]);

  const handleViewHistory = (booking: any) => {
    navigate(`/auditLog?entityName=Booking&entityId=${booking.id}`);
  };

  const handleCancel = async () => {
    if (!bookingId) return;
    try {
      await cancelBooking(bookingId).unwrap();
      toast.success("Booking cancelled successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
    setBookingId(null);
    setConfirmationModel(false);
  };

  const getStatusBadge = (status: number) => {
    const labels: Record<number, string> = { 1: "Booked", 2: "In House", 3: "Completed", 4: "Cancelled" };
    const styles: Record<number, string> = {
      1: "bg-primary/10 text-primary border-primary/20",
      2: "bg-success/10 text-success border-success/20",
      3: "bg-muted text-text-muted border-border",
      4: "bg-danger/10 text-danger border-danger/20",
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${styles[status] || "bg-muted text-text-muted"}`}>
        {labels[status] || "Unknown"}
      </span>
    );
  };

  if (isLoading) return (
    <div className="py-32 text-center bg-layout min-h-screen">
      <div className="animate-bounce text-primary font-black text-2xl">...</div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 min-h-screen w-full font-sans bg-layout">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6">
        <div>
          <h1 className="text-2xl font-black text-text-main tracking-tight">Booking Management</h1>
          <p className="text-text-muted text-sm">Review and manage all guest reservations</p>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto px-6 py-3 bg-primary text-surface rounded-2xl text-xs font-bold shadow-xl shadow-primary/10 hover:bg-primary-hover transition-all active:scale-95"
        >
          + Create New Booking
        </button>
      </div>
      <div className="bg-surface p-6 rounded-3xl shadow-sm border border-border mb-8 flex flex-col lg:flex-row items-center gap-4">
        <div className="flex flex-1 gap-4 w-full">
          <input
            type="text"
            placeholder="Search by user email..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="flex-1 border border-border p-3 rounded-xl focus:ring-4 focus:ring-primary/5 outline-none text-sm transition-all bg-layout/30 text-text-main"
          />
          <input
            type="text"
            placeholder="Room #"
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="w-24 border border-border p-3 rounded-xl focus:ring-4 focus:ring-primary/5 outline-none text-sm transition-all text-center font-bold bg-layout/30 text-text-main"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(Number(e.target.value))}
          className="border border-border p-3 rounded-xl focus:ring-4 focus:ring-primary/5 bg-surface outline-none w-full lg:w-48 text-sm font-bold text-text-main cursor-pointer"
        >
          <option value={0}>All Statuses</option>
          <option value={1}>Booked</option>
          <option value={2}>In House</option>
          <option value={3}>Completed</option>
          <option value={4}>Cancelled</option>
        </select>
      </div>
      <div className="hidden md:block bg-surface rounded-3xl border border-border shadow-sm mb-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left table-auto">
            <thead className="bg-muted text-text-muted border-b border-border text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="py-5 px-8 whitespace-nowrap">Ref ID</th>
                <th className="py-5 px-8 whitespace-nowrap">Guest Details</th>
                <th className="py-5 px-8 whitespace-nowrap">Room</th>
                <th className="py-5 px-8 whitespace-nowrap">Dates</th>
                <th className="py-5 px-8 text-center whitespace-nowrap">Status</th>
                <th className="py-5 px-8 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted">
              {bookings?.data.length ? bookings.data.map((b) => (
                <tr key={b.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="py-5 px-8 text-text-muted font-mono text-[11px] whitespace-nowrap uppercase">
                    {b.bugId || <span className="opacity-20 italic text-[9px]">no-id</span>}
                  </td>
                  <td className="py-5 px-8 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-semibold text-text-main group-hover:text-primary transition-colors">{b.guestName}</span>
                      <span className="text-[11px] text-text-muted font-medium italic">{b.guestEmail}</span>
                    </div>
                  </td>
                  <td className="py-5 px-8 font-bold text-text-main whitespace-nowrap">Room {b.roomNumber}</td>
                  <td className="py-5 px-8 text-xs font-semibold text-text-main whitespace-nowrap">
                    <div className="flex flex-col">
                      <span>{dayjs(b.checkInDate).format("DD MMM, YYYY")}</span>
                      <span className="text-[10px] text-text-muted">to {dayjs(b.checkOutDate).format("DD MMM, YYYY")}</span>
                    </div>
                  </td>
                  <td className="py-5 px-8 text-center whitespace-nowrap">{getStatusBadge(b.status)}</td>
                  <td className="py-5 px-8 text-right whitespace-nowrap">
                    <div className="flex justify-end items-center gap-4">
                      <button 
                        onClick={() => handleViewHistory(b)}
                        className="p-1 hover:bg-primary/10 rounded-lg transition-all text-primary/60 hover:text-primary"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>

                      {(b.status === 1 || b.status === 2) ? (
                        <>
                          <button onClick={() => setEditingBooking(b)} className="hover:scale-110 transition-transform p-1 shrink-0">
                            <img src={editIcon} alt="Edit" className="w-5 h-5 opacity-70 hover:opacity-100" />
                          </button>
                          <button
                            onClick={() => { setBookingId(b.id); setConfirmationModel(true); }}
                            className="text-danger hover:text-danger-hover text-[10px] font-black uppercase tracking-tighter transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <span className="text-text-muted/30 text-[10px] italic font-bold uppercase">Locked</span>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="py-20 text-center text-text-muted italic">No bookings found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:hidden mb-6">
        {bookings?.data.map((b) => (
          <div key={b.id} className="bg-surface p-5 rounded-3xl shadow-sm border border-border">
            <div className="flex justify-between items-start mb-4">
              <div className="max-w-[70%]">
                <span className="text-primary font-black text-[10px] tracking-tighter uppercase">
                    {b.bugId ? `Ref: ${b.bugId}` : `ID: #${b.id}`}
                </span>
                <h3 className="font-bold text-text-main leading-tight mt-1 truncate">{b.guestName}</h3>
                <p className="text-[11px] text-text-muted truncate">{b.guestEmail}</p>
              </div>
              <div className="flex flex-col items-end shrink-0">
                {getStatusBadge(b.status)}
              </div>
            </div>

            <div className="bg-layout/50 rounded-2xl p-4 mb-4 grid grid-cols-2 gap-4 border border-border/50">
               <div>
                  <p className="text-[9px] uppercase text-text-muted font-black tracking-widest mb-1">Room</p>
                  <p className="text-sm font-black text-text-main">{b.roomNumber}</p>
               </div>
               <div className="text-right">
                  <p className="text-[9px] uppercase text-text-muted font-black tracking-widest mb-1">Check-in</p>
                  <p className="text-xs font-bold text-text-main">{dayjs(b.checkInDate).format("DD MMM")}</p>
               </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-muted mt-2">
              <div className="text-[10px] text-text-muted font-medium italic">
                Out: {dayjs(b.checkOutDate).format("DD MMM, YYYY")}
              </div>
              <div className="flex gap-2 items-center min-w-fit">
                <button 
                  onClick={() => handleViewHistory(b)}
                  className="p-2 bg-primary/10 text-primary rounded-lg active:scale-90 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>

                {(b.status === 1 || b.status === 2) ? (
                  <>
                    <button 
                      onClick={() => setEditingBooking(b)} 
                      className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-xl active:scale-90 transition-all"
                    >
                      <img src={editIcon} alt="Edit" className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button 
                      onClick={() => { setBookingId(b.id); setConfirmationModel(true); }}
                      className="px-3 py-2 bg-danger/10 text-danger text-[10px] font-black uppercase rounded-xl active:scale-90 transition-all"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                    <span className="text-[10px] text-text-muted/40 font-black uppercase tracking-widest">Archived</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-10">
        <PagingController
          dataLength={bookings?.metaData.totalCount ?? 0}
          itemPerPage={pageSize}
          currentPage={currentPage}
          goToPrevious={() => setCurrentPage(p => Math.max(1, p - 1))}
          goToNext={() => setCurrentPage(p => p + 1)}
          goToSpecificPage={setCurrentPage}
        />
      </div>

      <Modal title="Create New Booking" isOpen={isAddModalOpen} closeModal={() => setIsAddModalOpen(false)}>
        <AddBookingForm closeModel={() => setIsAddModalOpen(false)} />
      </Modal>

      <Modal title="Update Booking Details" isOpen={!!editingBooking} closeModal={() => setEditingBooking(null)}>
        {editingBooking && <UpdateBookingForm data={editingBooking} closeModel={() => setEditingBooking(null)} />}
      </Modal>

      {isConfirmationModelOpen && (
        <ConfirmationModel 
          label="Are you sure you want to cancel this booking? This action cannot be undone." 
          actionText="Cancellation" 
          isConfirmationModelOpen={setConfirmationModel} 
          submitAction={handleCancel} 
          classname="bg-danger hover:bg-danger-hover shadow-danger/20"
        />
      )}
    </div>
  );
};

export default BookingManagement;