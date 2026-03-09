import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { fetchRoomType } from "@/app/asyncThunk/roomTypeThunk";
import PagingController from "../common/paging/PagingController";
import Button from "../common/button/Button";
import deleteIcon from "@/assets/deleteIcon.png";
import editIcon from "@/assets/editIcon.png";
import AddRoomTypeModal from "./AddRoomTypeModal";

function RoomCategoryManagement() {
  const dispatch = useAppDispatch();
  const { roomTypes, loading, error } = useAppSelector((state) => state.roomType);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  useEffect(() => {
    // dispatch(fetchRoomType());
  }, [dispatch]);

  const currentItems = useMemo(() => {
    return roomTypes.slice(startIndex, endIndex);
  }, [roomTypes, startIndex, endIndex]);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      // dispatch(deleteRoomType(id));
      console.log("Deleting Category ID:", id);
    }
  };

  const goToNextPage = () => setCurrentPage((prev) => prev + 1);
  const goToPrevPage = () => setCurrentPage((prev) => prev - 1);
  const goToSpecificPage = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) return <p className="p-6 text-center text-gray-500 font-medium">Loading Room Categories...</p>;
  if (error) return <p className="p-6 text-center text-red-500 font-medium">{error}</p>;

  return (
    <div className="mt-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Room Categories</h2>
          <p className="text-xs text-gray-500">Manage pricing, capacity, and amenities for room types</p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          label="Add Category"
          className="w-full sm:w-auto px-6 h-10 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transition-all"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {currentItems.map((type) => (
          <div key={type.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-lg font-bold text-gray-900">{type.roomTypeName}</span>
                <p className="text-sm font-semibold text-blue-600">${type.pricePerNight}/night</p>
              </div>
              <div className="flex gap-3">
                <img src={editIcon} className="w-5 h-5 cursor-pointer" onClick={() => setEditingCategory(type)} alt="Edit" />
                <img src={deleteIcon} className="w-5 h-5 cursor-pointer" onClick={() => handleDelete(type.id)} alt="Delete" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">Capacity:</span> {type.capacity} Persons
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {type.amenities?.map((amenity, index) => (
                  <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded font-medium">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden md:block overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <table className="min-w-full text-left">
          <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="py-4 px-6">Category Name</th>
              <th className="py-4 px-6 text-center">Capacity</th>
              <th className="py-4 px-6">Price / Night</th>
              <th className="py-4 px-6">Amenities</th>
              <th className="py-4 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {currentItems.map((type) => (
              <tr key={type.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="py-4 px-6">
                   <div className="font-bold text-gray-800">{type.roomTypeName}</div>
                   <div className="text-[10px] text-gray-400 font-mono">ID: #{type.id}</div>
                </td>
                <td className="py-4 px-6 text-center font-medium text-gray-700">
                  {type.capacity}
                </td>
                <td className="py-4 px-6">
                  <span className="font-bold text-gray-900">${type.pricePerNight}</span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-wrap gap-1.5 max-w-xs">
                    {type.amenities && type.amenities.length > 0 ? (
                      type.amenities.map((amenity, index) => (
                        <span 
                          key={index} 
                          className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded border border-blue-100 uppercase"
                        >
                          {amenity}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 italic text-xs">No amenities listed</span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex justify-center items-center gap-4">
                    <button 
                      onClick={() => setEditingCategory(type)}
                      className="p-1.5 hover:bg-white rounded-md shadow-sm border border-transparent hover:border-gray-200 transition-all"
                    >
                      <img src={editIcon} alt="Edit" className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(type.id)}
                      className="p-1.5 hover:bg-white rounded-md shadow-sm border border-transparent hover:border-gray-200 transition-all"
                    >
                      <img src={deleteIcon} alt="Delete" className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-white p-4 rounded-lg border border-gray-100 flex justify-center">
        <PagingController
          dataLength={roomTypes.length}
          itemPerPage={itemsPerPage}
          currentPage={currentPage}
          goToPrevious={goToPrevPage}
          goToNext={goToNextPage}
          goToSpecificPage={goToSpecificPage}
        />
      </div>
      {isCreateModalOpen && <AddRoomTypeModal closeModal={() => setIsCreateModalOpen(false)} />}
    </div>
  );
}

export default RoomCategoryManagement;