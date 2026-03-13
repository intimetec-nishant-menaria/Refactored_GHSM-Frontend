import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { deleteRoom, fetchRooms } from "@/app/asyncThunk/roomThunk";
import PagingController from "../common/paging/PagingController";
import deleteIcon from "@/assets/deleteIcon.png";
import editIcon from "@/assets/editIcon.png";
import Button from "../common/button/Button";
import AddRoomModel from "./addRoomModel";
import RoomCategoryManagement from "../roomCategoryManagement/roomCategoryManagement.tsx"
import type { RoomTypesPayload } from "@/utils/interfaces/roomTypes";
import UpdateRoomModel from "./UpdateRoomModel";
import { fetchRoomType } from "@/app/asyncThunk/roomTypeThunk";
import RoomStatusDropDown from "../common/roomStatusDropDown/RoomStatusDropDown.tsx";
import ConfirmationModel from "../common/confirmationModel/confirmationModel.tsx";

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
  const [isRoomManagementOpen , setIsRoomManagementOpen] = useState(true);
  const [isConfirmationModelOpen , setConfirmationModel] = useState(false);
  const [roomId , setRoomId] = useState<number | null>(null);

  const filteredItems = useMemo(() => {
    let temp = roomTypeFilter === 0 ? rooms : rooms.filter(room => room.roomTypeId === roomTypeFilter);
    return roomStatusFilter === 0 ? temp : temp.filter(room => room.roomStatus === roomStatusFilter);
  }, [roomTypeFilter, rooms, roomStatusFilter]);

  const currentItems = useMemo(() => {
    return filteredItems.slice(startIndex, endIndex);
  }, [filteredItems, startIndex, endIndex]);

  const [isCreateRoomModalOpen, setIsCreateModalOpen] = useState(false);
  const openCreateRoomModal = () => setIsCreateModalOpen(true);
  const closeModel = () => setIsCreateModalOpen(false);

  const [editingRoom, setEditingRoom] = useState<RoomTypesPayload | null>(null);
  const openUpdateRoomModel = (room: RoomTypesPayload) => setEditingRoom(room);
  const closeUpdateRoomModel = () => setEditingRoom(null);

  useEffect(() => {
    dispatch(fetchRooms());
    dispatch(fetchRoomType());
  }, [dispatch]);

  const handleDelete = async (roomid: number) => {
      await dispatch(deleteRoom(roomid));
      await dispatch(fetchRooms());
      setRoomId(null);
      setConfirmationModel(false);
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
      <div className="h-10 w-full flex justify-center items-center">
        <button onClick={()=>setIsRoomManagementOpen(true)} className={`w-1/2 h-full ${isRoomManagementOpen ? "bg-gray-100" : "bg-white shadow-2xl rounded-2xl"} cursor-pointer`}>Room Management</button>
        <button onClick={()=>setIsRoomManagementOpen(false)} className={`w-1/2 h-full ${isRoomManagementOpen ? "bg-white shadow-2xl rounded-2xl" : "bg-gray-100"} cursor-pointer`}>Room Category Management</button>
      </div>
      {
        isRoomManagementOpen ? (
          <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <Button
              onClick={openCreateRoomModal}
              label="Add Room"
              className="w-full sm:w-32 h-10 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-all"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Room Type</label>
              <select 
                value={roomTypeFilter} 
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setRoomTypeFilter(Number(e.target.value))}
               className="w-full border border-slate-200 p-2.5 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white outline-none transition-all cursor-pointer"
              >
                <option value={0}>All Types</option>
                {roomTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.roomTypeName}</option>
                ))}
              </select>
            </div>
            <RoomStatusDropDown roomStatus={roomStatusFilter}  setRoomStatus={setRoomStatusFilter}/>
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
                  <p><span className="text-gray-500 block">Price</span> Rs.{room.pricePerNight}/night</p>
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
                        <img src={deleteIcon} alt="Delete" className="cursor-pointer w-5 h-5 hover:scale-110" onClick={()=>{
                          setRoomId(room.id)
                          setConfirmationModel(true)
                        }} />
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
            {isCreateRoomModalOpen && <AddRoomModel closeModel={closeModel} />}
            {editingRoom && (
              <UpdateRoomModel closeModel={closeUpdateRoomModel} data={editingRoom} />
            )}
          </div>
        </>
        ):(
          <RoomCategoryManagement/>
        )
      }
      {isConfirmationModelOpen && <ConfirmationModel label="Are you sure you want to delete this Room?" isConfirmationModelOpen={setConfirmationModel} submitAction={()=>handleDelete(roomId)}/>}
    </div>
  );
};

export default RoomManagement;