import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { deleteRoom, fetchRooms } from "@/app/asyncThunk/roomThunk";
import PagingController from "../common/paging/PagingController";
import deleteIcon from "@/assets/deleteIcon.png";
import editIcon from "@/assets/editIcon.png";
import Button from "../common/button/Button";
import AddRoomModel from "./addRoomModel";
import type { RoomTypesPayload } from "@/utils/interfaces/roomTypes";
import UpdateRoomModel from "./UpdateRoomModel";
import { fetchRoomType } from "@/app/asyncThunk/roomTypeThunk";

const RoomManagement = () => {
  const dispatch = useAppDispatch();

  const { rooms, loading, error } = useAppSelector((state) => state.room);
  const { roomTypes, loading: roomTypesLoading, error: roomTypesError } = useAppSelector((state) => state.roomType);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(5); 
  const startIndex = (currentPage - 1) * itemPerPage;
  const endIndex = startIndex + itemPerPage;

  const [roomTypeFilter, setRoomTypeFilter] = useState(0);
  const [roomStatusFilter, setRoomStatusFilter] = useState(0);

  const filteredItems = useMemo(() => {
    let temp = roomTypeFilter === 0 ? rooms : rooms.filter(room => room.roomTypeId === roomTypeFilter);
    return roomStatusFilter === 0 ? temp : temp.filter(room => room.roomStatus === roomStatusFilter);
  }, [roomTypeFilter, rooms, roomStatusFilter]);

  const currentItems = useMemo(() => {
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, startIndex, endIndex]);

  const [isCreateRoomModalOpen, setIsCreateModalOpen] = useState(false);
  const openCreateRoomModal = () => setIsCreateModalOpen(true);
  const closeModal = () => setIsCreateModalOpen(false);

  const [editingRoom, setEditingRoom] = useState<RoomTypesPayload | null>(null);
  const openUpdateRoomModel = (room: RoomTypesPayload) => setEditingRoom(room);
  const closeUpdateRoomModel = () => setEditingRoom(null);

  useEffect(() => {
    dispatch(fetchRooms());
    dispatch(fetchRoomType());
  }, [dispatch]);

  const handleDelete = (roomid: number) => {
    if (window.confirm("Delete this room?")) {
      dispatch(deleteRoom(roomid));
      dispatch(fetchRooms());
    }
  };
  const goToNextPage = () => setCurrentPage(prev => prev + 1);
  const goToPrevPage = () => setCurrentPage(prev => prev - 1);
  const goToSpecificPage = (pageNumber: number) => setCurrentPage(pageNumber);

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1: return "Available";
      case 2: return "Occupied";
      case 3: return "Maintenance";
      case 4: return "Out Of Order";
      default: return "Unknown";
    }
  };

  if (loading || roomTypesLoading) return <p className="p-6 text-center">Loading...</p>;
  if (error || roomTypesError) return <p className="p-6 text-center text-red-500">{error || roomTypesError}</p>;

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800">Room Management</h1>
        <Button
          onClick={openCreateRoomModal}
          label="Add Room"
          className="w-full sm:w-32 h-10 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-all"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Room Type</label>
          <select 
            value={roomTypeFilter} 
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setRoomTypeFilter(Number(e.target.value))}
            className="w-full border p-2 rounded bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value={0}>All Types</option>
            {roomTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.roomTypeName}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Status</label>
          <select 
            value={roomStatusFilter} 
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setRoomStatusFilter(Number(e.target.value))}
            className="w-full border p-2 rounded bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value={0}>All Status</option>
            <option value={1}>Available</option>
            <option value={2}>Occupied</option>
            <option value={3}>Maintenance</option>
            <option value={4}>Out Of Order</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {currentItems.map((room) => (
          <div key={room.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-lg font-bold text-blue-600">Room {room.roomNumber}</span>
              <div className="flex gap-4">
                <img src={editIcon} alt="Edit" className="w-5 h-5" onClick={() => openUpdateRoomModel(room)} />
                <img src={deleteIcon} alt="Delete" className="w-5 h-5" onClick={() => handleDelete(room.id)} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <p><span className="text-gray-500 block">Type</span> {room.roomTypeName}</p>
              <p><span className="text-gray-500 block">Price</span> ${room.pricePerNight}/night</p>
              <p><span className="text-gray-500 block">Capacity</span> {room.capacity} Persons</p>
              <p><span className="text-gray-500 block">Status</span> 
                <span className={`font-semibold ${room.roomStatus === 1 ? 'text-green-600' : 'text-amber-600'}`}>
                  {getStatusLabel(room.roomStatus)}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md mb-6">
        <table className="min-w-full text-left">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
            <tr>
              <th className="py-3 px-4">Room No.</th>
              <th className="py-3 px-4">Room Type</th>
              <th className="py-3 px-4 text-center">Capacity</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentItems.map(room => (
              <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 font-medium">{room.roomNumber}</td>
                <td className="py-4 px-4">{room.roomTypeName}</td>
                <td className="py-4 px-4 text-center">{room.capacity}</td>
                <td className="py-4 px-4 font-semibold">${room.pricePerNight}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    room.roomStatus === 1 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  }`}>
                    {getStatusLabel(room.roomStatus)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex justify-center items-center gap-3">
                    <img src={editIcon} alt="Edit" className="cursor-pointer w-5 h-5 hover:scale-110" onClick={() => openUpdateRoomModel(room)} />
                    <span className="text-gray-300">|</span>
                    <img src={deleteIcon} alt="Delete" className="cursor-pointer w-5 h-5 hover:scale-110" onClick={() => handleDelete(room.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <PagingController
          dataLength={filteredItems.length}
          itemPerPage={itemPerPage}
          currentPage={currentPage}
          goToPrevious={goToPrevPage}
          goToNext={goToNextPage}
          goToSpecificPage={goToSpecificPage}
        />
      </div>
      {isCreateRoomModalOpen && <AddRoomModel closeModal={closeModal} />}
      {editingRoom && (
        <UpdateRoomModel closeModal={closeUpdateRoomModel} room={editingRoom} />
      )}
    </div>
  );
};

export default RoomManagement;