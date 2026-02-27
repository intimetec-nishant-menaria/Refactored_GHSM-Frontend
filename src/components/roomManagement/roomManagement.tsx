import { useEffect, useMemo, useState } from "react";
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
  const { roomTypes , loading:roomTypesLoading , error:roomTypesError} =useAppSelector((state)=> state.roomType);
  const [currentPage , setCurrentPage] = useState(1);
  const [itemPerPage , setItemPerPage] = useState(2);
  const startIndex = (currentPage-1) * itemPerPage;
  const endIndex = startIndex + itemPerPage;
  
  const [roomTypeFilter , setRoomTypeFilter] = useState(0);
  const [roomStatusFilter , setRoomStatusFilter] = useState(0);

  const filteredItems = useMemo(()=>{
    let temp = roomTypeFilter == 0 ? rooms : rooms.filter(room=>room.roomTypeId==roomTypeFilter);
    return roomStatusFilter == 0 ? temp : temp.filter(room=>room.roomStatus==roomStatusFilter);
  },[roomTypeFilter,rooms,roomStatusFilter]);

  const currentItems = useMemo(()=>{
    return filteredItems.slice(startIndex,endIndex);
  },[rooms ,currentPage ,roomTypeFilter,roomStatusFilter]);

  const [isCreateRoomModalOpen, setIsCreateModalOpen] = useState(false);
  const openCreateRoomModal = ()=> setIsCreateModalOpen(true);
  const closeModal = ()=>setIsCreateModalOpen(false);

  const [editingRoom , setEditingRoom] = useState<RoomTypesPayload | null>(null);
  const openUpdateRoomModel = ( room : RoomTypesPayload )=> setEditingRoom(room);
  const closeUpdateRoomModel = ()=>setEditingRoom(null);

  useEffect(() => {
    dispatch(fetchRooms());
    dispatch(fetchRoomType());
  }, [dispatch]);

  function handleDelete(roomid:number){
    dispatch(deleteRoom(roomid));
    dispatch(fetchRooms());
  }

  function goToNextPage() {
      setCurrentPage(currentPage + 1);
  }

  function goToPrevPage() {
      setCurrentPage(currentPage - 1);
  }

  function goToSpecificPage(pageNumber:number) {
      setCurrentPage(pageNumber);
  }

  if (loading || roomTypesLoading) return <p className="p-4">Loading...</p>;
  if (error || roomTypesError) return <p className="p-4 text-red-500">{error || roomTypesError }</p>;

  return(
    <div className="p-6 bg-gray-100 h-full w-full">
      <div className="flex justify-between m-1.5 items-center mb-4">
      <h1 className="text-2xl font-bold mb-4">Room Management</h1>
        <Button
          onClick={openCreateRoomModal}
          label="Add Room"
          className="w-32 h-10 px-3 py-1 text-sm bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
        />
      </div>
      <div className="flex mb-2">
        <div className="mr-2">
          <select id="RoomType"
              onChange={(e:ChangeEvent<HTMLInputElement>)=>setRoomTypeFilter(Number(e.target.value))} 
              value={roomTypeFilter} className="border p-2 rounded focus:ring-2 focus:ring-blue-500">
            <option key="0" value={0}>All</option>
            {roomTypes.map( (type)=>(
              <option key={type.id} value={type.id}>{type.roomTypeName}</option>
            ))}
          </select>
        </div>
        <div>
          <select id="RoomType"
              onChange={(e:ChangeEvent<HTMLInputElement>)=>setRoomStatusFilter(Number(e.target.value))} 
              value={roomStatusFilter} className="border p-2 rounded focus:ring-2 focus:ring-blue-500">
            <option key="0" value={0}>All</option>
            <option key="1" value={1}>Available</option>
            <option key="2" value={2}>Occupied</option>
            <option key="3" value={3}>Maintainance</option>
            <option key="4" value={4}>Out Of Order</option>
          </select>
        </div>
    </div>
    <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md mb-4">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-2 px-4">Room Number</th>
              <th className="py-2 px-4">Room Type</th>
              <th className="py-2 px-4">Capacity</th>
              <th className="py-2 px-4">Price Per Night</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
              {currentItems.map(room=>(
                <tr key={room.id}>
                  <td className="py-2 px-4">{room.roomNumber}</td>
                  <td className="py-2 px-4">{room.roomTypeName}</td>
                  <td className="py-2 px-4">{room.capacity}</td>
                  <td className="py-2 px-4">{room.pricePerNight}</td>
                  <td className="py-2 px-4">{room.roomStatus == 1 ? "Available" : 
                        (room.roomStatus == 2 ? "Occupied" :
                        (room.roomStatus == 3 ? "Maintainance" : "Out Of Order"))}</td>
                  <td className="py-2 px-4 flex gap-2">
                  <img
                    src={deleteIcon}
                    alt="Delete"
                    className="cursor-pointer w-5 h-5"
                    onClick={() => handleDelete(room.id)}
                  />
                  /
                  <img
                    src={editIcon}
                    alt="Update"
                    className="cursor-pointer w-5 h-5"
                    onClick={() => openUpdateRoomModel(room)}
                  />
                </td>
                </tr>
              ))}
          </tbody>
         </table>
        {<PagingController
            dataLength={filteredItems.length}
            itemPerPage={itemPerPage}
            currentPage={currentPage}
            goToPrevious={goToPrevPage}
            goToNext={goToNextPage}
            goToSpecificPage={goToSpecificPage} /> }
      </div>
      {isCreateRoomModalOpen && <AddRoomModel closeModal={closeModal}/>}
      {editingRoom && (
        <UpdateRoomModel closeModal={closeUpdateRoomModel} room={editingRoom} />
      )}
    </div>
  )
};

export default RoomManagement;
