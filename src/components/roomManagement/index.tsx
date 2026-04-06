import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import PagingController from "../common/paging/PagingController.tsx";
import deleteIcon from "@/assets/deleteIcon.png";
import editIcon from "@/assets/editIcon.png";
import RoomStatusDropDown from "../common/roomStatusDropDown/RoomStatusDropDown.tsx";
import ConfirmationModel from "../common/confirmationModel/confirmationModel.tsx";
import Modal from "../common/modal/index.tsx";
import AddRoomForm from "./addRoomForm/index.tsx";
import UpdateRoomForm from "./updateRoomForm/index.tsx";
import { useDeleteRoomMutation, useFetchAllRoomsQuery } from "@/app/Api's/room.ts";
import toast from "react-hot-toast";
import type { RoomData } from "@/utils/interfaces/room.ts";

const RoomManagement = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [roomStatusFilter, setRoomStatusFilter] = useState(0);
  const [isConfirmationModelOpen, setConfirmationModel] = useState(false);
  const [roomId, setRoomId] = useState<number | null>(null);
  const [roomNumberFilter, setRoomNumberFilter] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");

  const { data: rooms, isLoading } = useFetchAllRoomsQuery({
    currentPage,
    pageSize,
    roomStatusFilter,
    roomNumberFilter: debounceSearch,
  });

  const [deleteRoom] = useDeleteRoomMutation();
  const [isCreateRoomFormOpen, setIsCreateFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<RoomData | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebounceSearch(roomNumberFilter), 500);
    return () => clearTimeout(timer);
  }, [roomNumberFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debounceSearch, roomStatusFilter]);

  const handleViewHistory = (room: RoomData) => {
    navigate(`/auditLog?entityName=Room&entityId=${room.id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRoom(id).unwrap();
      toast.success("Room deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
    setRoomId(null);
    setConfirmationModel(false);
  };

  const getStatusBadge = (status: number) => {
    const labels: Record<number, string> = { 
        1: "Available", 2: "Occupied", 3: "Maintenance", 4: "Out Of Order" 
    };
    
    const styles: Record<number, string> = {
      1: "bg-success/10 text-success border-success/20",
      2: "bg-primary/10 text-primary border-primary/20",
      3: "bg-amber-50 text-amber-600 border-amber-100", 
      4: "bg-danger/10 text-danger border-danger/20",
    };

    return (
      <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${styles[status] || "bg-muted text-text-muted"}`}>
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
          <h1 className="text-2xl font-black text-text-main tracking-tight">Room Management</h1>
          <p className="text-text-muted text-sm">Configure floor layouts and track room availability</p>
        </div>
        
        <button
          onClick={() => setIsCreateFormOpen(true)}
          className="w-full sm:w-auto px-6 py-3 bg-primary text-surface rounded-2xl text-xs font-bold shadow-xl shadow-primary/10 hover:bg-primary-hover transition-all active:scale-95"
        >
          + Add New Room
        </button>
      </div>

      <div className="bg-surface p-6 rounded-3xl shadow-sm border border-border mb-8 flex flex-col lg:flex-row items-end gap-6">
        <div className="flex flex-col gap-2 w-full lg:w-64">
          <label className="text-[11px] font-black uppercase tracking-widest text-text-muted/60 ml-1">Room Number</label>
          <input
            type="text"
            placeholder="Search e.g. 101"
            value={roomNumberFilter}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setRoomNumberFilter(e.target.value)}
            className="border border-border p-3 rounded-xl focus:ring-4 focus:ring-primary/5 outline-none text-sm transition-all bg-layout/30 font-bold text-text-main"
          />
        </div>
        <div className="w-full lg:w-64">
            <RoomStatusDropDown roomStatus={roomStatusFilter} setRoomStatus={setRoomStatusFilter} />
        </div>
      </div>

      <div className="hidden md:block bg-surface rounded-3xl border border-border shadow-sm mb-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left table-auto">
            <thead className="bg-muted text-text-muted border-b border-border text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="py-5 px-8 whitespace-nowrap">Room Info</th>
                <th className="py-5 px-8 text-center whitespace-nowrap">Floor Level</th>
                <th className="py-5 px-8 text-center whitespace-nowrap">Status</th>
                <th className="py-5 px-8 text-right whitespace-nowrap min-w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-muted">
              {rooms?.data.map((room) => (
                <tr key={room.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="py-5 px-8 whitespace-nowrap">
                    <span className="font-bold text-text-main text-lg group-hover:text-primary transition-colors">
                      Room {room.roomNumber}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-center whitespace-nowrap">
                    <span className="px-3 py-1 bg-muted text-text-muted rounded-lg text-xs font-bold border border-border/50">
                      Floor {room.floor || "0"}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-center whitespace-nowrap">
                    {getStatusBadge(room.status)}
                  </td>
                  <td className="py-5 px-8 text-right whitespace-nowrap">
                    <div className="flex justify-end items-center gap-4 flex-nowrap shrink-0">
                      <button 
                        onClick={() => handleViewHistory(room)}
                        title="View Room Logs"
                        className="p-2 hover:bg-primary/10 rounded-lg transition-all text-primary/60 hover:text-primary"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>

                      <button 
                        onClick={() => setEditingRoom(room)} 
                        className="p-2 hover:bg-muted rounded-lg transition-all hover:shadow-sm shrink-0"
                      >
                        <img src={editIcon} alt="Edit" className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity" />
                      </button>
                      <button
                        onClick={() => { setRoomId(room.id); setConfirmationModel(true); }}
                        className="p-2 hover:bg-danger/10 rounded-lg transition-all group/del shrink-0"
                      >
                        <img src={deleteIcon} alt="Delete" className="w-5 h-5 opacity-40 group-hover/del:opacity-100 transition-opacity grayscale group-hover/del:grayscale-0" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden mb-6">
        {rooms?.data.map((room) => (
          <div key={room.id} className="bg-surface p-5 rounded-3xl shadow-sm border border-border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted/60">Room Number</p>
                <h3 className="text-xl font-bold text-text-main leading-tight">Room {room.roomNumber}</h3>
              </div>
              {getStatusBadge(room.status)}
            </div>
            
            <div className="flex justify-between items-center bg-layout/50 p-4 rounded-2xl border border-border/50">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted/60 mb-0.5">Floor Level</p>
                <p className="text-sm font-bold text-text-main">Level {room.floor || "0"}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleViewHistory(room)}
                  className="p-2.5 bg-surface border border-border rounded-xl shadow-sm shrink-0 text-primary/70"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>

                <button onClick={() => setEditingRoom(room)} className="p-2.5 bg-surface border border-border rounded-xl shadow-sm shrink-0">
                  <img src={editIcon} alt="Edit" className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { setRoomId(room.id); setConfirmationModel(true); }} 
                  className="p-2.5 bg-surface border border-border rounded-xl shadow-sm shrink-0"
                >
                  <img src={deleteIcon} alt="Delete" className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {!rooms?.data.length && (
           <p className="text-center py-10 text-text-muted italic text-sm">No rooms found matching filters.</p>
        )}
      </div>

      <div className="flex justify-center mt-10">
        <PagingController
          dataLength={rooms?.metaData.totalCount ?? 0}
          itemPerPage={pageSize}
          currentPage={currentPage}
          goToPrevious={() => setCurrentPage(p => Math.max(1, p - 1))}
          goToNext={() => setCurrentPage(p => p + 1)}
          goToSpecificPage={setCurrentPage}
        />
      </div>
      
      <Modal title="Add New Room" isOpen={isCreateRoomFormOpen} closeModal={() => setIsCreateFormOpen(false)}>
        <AddRoomForm closeModel={() => setIsCreateFormOpen(false)} />
      </Modal>

      <Modal title="Update Room" isOpen={!!editingRoom} closeModal={() => setEditingRoom(null)}>
        {editingRoom && <UpdateRoomForm closeModel={() => setEditingRoom(null)} data={editingRoom} />}
      </Modal>

      {isConfirmationModelOpen && (
        <ConfirmationModel 
          label="Are you sure you want to delete this room? This action cannot be undone." 
          actionText="Delete Room"
          isConfirmationModelOpen={setConfirmationModel} 
          submitAction={() => handleDelete(roomId!)}
          classname="bg-danger hover:bg-danger-hover shadow-danger/20"
        />
      )}
    </div>
  );
};

export default RoomManagement;