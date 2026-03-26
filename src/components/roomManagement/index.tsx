import { type ChangeEvent,useState } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import PagingController from "../common/paging/PagingController.tsx";
import deleteIcon from "@/assets/deleteIcon.png";
import editIcon from "@/assets/editIcon.png";
import Button from "../common/button/Button.tsx";
import RoomCategoryManagement from "../roomCategoryManagement/index.tsx"
import type { RoomTypesPayload } from "@/utils/interfaces/roomTypes";
import RoomStatusDropDown from "../common/roomStatusDropDown/RoomStatusDropDown.tsx";
import ConfirmationModel from "../common/confirmationModel/confirmationModel.tsx";
import Modal from "../common/modal/index.tsx";
import AddRoomForm from "./addRoomForm/index.tsx";
import UpdateRoomForm from "./updateRoomForm/index.tsx";
import { useDeleteRoomMutation, useFetchAllRoomsQuery } from "@/app/Api's/room.ts";
import { useFetchAllRoomTypesQuery } from "@/app/Api's/roomType.ts";
import toast from "react-hot-toast";

const RoomManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5); 

  const [roomTypeFilter, setRoomTypeFilter] = useState(0);
  const [roomStatusFilter, setRoomStatusFilter] = useState(0);
  const [isRoomManagementOpen , setIsRoomManagementOpen] = useState(true);
  const [isConfirmationModelOpen , setConfirmationModel] = useState(false);
  const [roomId , setRoomId] = useState<number | null>(null);

  const {data:rooms , isLoading , isError ,error} = useFetchAllRoomsQuery({
    currentPage,
    pageSize,
    roomStatusFilter,
    roomTypeFilter
  })
  const {data : roomTypes , isLoading :roomTypesLoading , isError : roomTypesError  } = useFetchAllRoomTypesQuery();
  const [deleteRoom] = useDeleteRoomMutation();

  const [isCreateRoomFormOpen, setIsCreateFormOpen] = useState(false);
  const openCreateRoomForm = () => setIsCreateFormOpen(true);
  const closeCreateRoomForm = () => setIsCreateFormOpen(false);

  const [editingRoom, setEditingRoom] = useState<RoomTypesPayload | null>(null);
  const openUpdateRoomForm = (room: RoomTypesPayload) => setEditingRoom(room);
  const closeUpdateRoomForm = () => setEditingRoom(null);


  const handleDelete = async (roomid: number) => {
      try{
        await deleteRoom(roomid).unwrap();
        toast.success("room deleted successfully"); 
      }catch(err){
        toast.error(err?.data.message || "something went wrong");
      }
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

  if (isLoading || roomTypesLoading) return <p className="p-6 text-center">Loading...</p>;
  if (error || roomTypesError) return <p className="p-6 text-center text-red-500">{error || roomTypesError?.data.message}</p>;

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen w-full">
      <div className="h-12 w-full flex justify-center items-center border-b border-gray-200 bg-gray-100 rounded-t-2xl overflow-hidden relative z-10 -mb-px">
        <button
          onClick={() => setIsRoomManagementOpen(true)}
          className={`w-1/2 h-full flex justify-center items-center text-sm font-medium transition-all duration-150 cursor-pointer ${
            isRoomManagementOpen
              ? "bg-gray-100 text-blue-600 border-b-2 border-blue-600 font-semibold"
              : "bg-gray-200/70 text-gray-600 hover:bg-gray-200 border-b border-gray-200"
          }`}
        >
          Room Management
        </button>
        <button
          onClick={() => setIsRoomManagementOpen(false)}
          className={`w-1/2 h-full flex justify-center items-center text-sm font-medium transition-all duration-150 cursor-pointer ${
            !isRoomManagementOpen
              ? "bg-gray-100 text-blue-600 border-b-2 border-blue-600 font-semibold"
              : "bg-gray-200/70 text-gray-600 hover:bg-gray-200 border-b border-gray-200"
          }`}
        >
          Room Category Management
        </button>
      </div>
      {
        isRoomManagementOpen ? (
          <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Room management</h2>
            </div>
            <Button
              onClick={openCreateRoomForm}
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
                {roomTypes?.map((type) => (
                  <option key={type.id} value={type.id}>{type.roomTypeName}</option>
                ))}
              </select>
            </div>
            <RoomStatusDropDown roomStatus={roomStatusFilter}  setRoomStatus={setRoomStatusFilter}/>
          </div>
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {rooms?.data.map((room) => (
              <div key={room.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-blue-600">Room {room.roomNumber}</span>
                  <div className="flex gap-4">
                    <img src={editIcon} alt="Edit" className="w-5 h-5" onClick={() => openUpdateRoomForm(room)} />
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
                {rooms?.data.map(room => (
                  <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-medium">{room.roomNumber}</td>
                    <td className="py-4 px-4">{room.roomTypeName}</td>
                    <td className="py-4 px-4 text-center">{room.capacity}</td>
                    <td className="py-4 px-4 font-semibold">₹{room.pricePerNight}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        room.roomStatus === 1 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {getStatusLabel(room.roomStatus)}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center items-center gap-3">
                        <img src={editIcon} alt="Edit" className="cursor-pointer w-5 h-5 hover:scale-110" onClick={() => openUpdateRoomForm(room)} />
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
              dataLength={rooms?.metaData.totalCount ?? 0}
              itemPerPage={pageSize}
              currentPage={currentPage}
              goToPrevious={goToPrevPage}
              goToNext={goToNextPage}
              goToSpecificPage={goToSpecificPage}
            />
            <Modal title="Add New Room"
              subTitle="Register a new unit in the guest house system."
              isOpen={isCreateRoomFormOpen}
              closeModal={closeCreateRoomForm}
              >
                <AddRoomForm closeModel={closeCreateRoomForm}/>
            </Modal>
            <Modal title="Update Room Details" isOpen={editingRoom} closeModal={closeUpdateRoomForm}>
                <UpdateRoomForm closeModel={closeUpdateRoomForm} data={editingRoom!}/>
            </Modal>
          </div>
        </>
        ):(
          <RoomCategoryManagement/>
        )
      }
      {isConfirmationModelOpen && <ConfirmationModel label="Are you sure you want to delete this Room?" isConfirmationModelOpen={setConfirmationModel} submitAction={()=>handleDelete(roomId!)}/>}
    </div>
  );
};

export default RoomManagement;