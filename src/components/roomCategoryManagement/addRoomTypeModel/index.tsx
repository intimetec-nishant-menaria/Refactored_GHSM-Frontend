import React, { useState } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import Button from "../../common/button/Button";
import { fetchRoomType } from "@/app/asyncThunk/roomType";

interface AddRoomTypeModelProps {
  closeModal: () => void;
}

const RoomTypeOptions = [
  { value: 1, label: "Single" },
  { value: 2, label: "Double" },
  { value: 3, label: "Suite" },
  { value: 4, label: "Deluxe" },
];

const AddRoomTypeModel = ({ closeModal }: AddRoomTypeModelProps) => {
  const dispatch = useAppDispatch();
  const { amenities } = useAppSelector((state) => state.amenities); // Assuming you have an amenity slice

  const [formData, setFormData] = useState({
    roomTypeName: 1,
    capacity: 1,
    pricePerNight: 0,
    amenityIds: [] as number[],
  });

  console.log(amenities);

  const handleAmenityToggle = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      amenityIds: prev.amenityIds.includes(id)
        ? prev.amenityIds.filter((itemId) => itemId !== id)
        : [...prev.amenityIds, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      //   await dispatch(createRoomType(formData)).unwrap();
      dispatch(fetchRoomType());
      closeModal();
    } catch (err) {
      console.error("Failed to create room type:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
          <h3 className="text-lg font-bold">Add New Room Category</h3>
          <button onClick={closeModal} className="hover:text-gray-200 text-2xl">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Room Type
            </label>
            <select
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.roomTypeName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  roomTypeName: Number(e.target.value),
                })
              }
            >
              {RoomTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Capacity (Persons)
              </label>
              <input
                type="number"
                min="1"
                className="w-full border rounded-lg p-2.5"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: Number(e.target.value) })
                }
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Price Per Night
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">$</span>
                <input
                  type="number"
                  step="0.01"
                  className="w-full border rounded-lg p-2.5 pl-7"
                  value={formData.pricePerNight}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      pricePerNight: Number(e.target.value),
                    })
                  }
                  required
                />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">
              Amenities
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-lg p-3 bg-gray-50">
              {amenities?.map((amenity) => (
                <label
                  key={amenity.id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-blue-600"
                    checked={formData.amenityIds.includes(amenity.id)}
                    onChange={() => handleAmenityToggle(amenity.id)}
                  />
                  <span className="text-sm text-gray-700">{amenity.name}</span>
                </label>
              ))}
              {(!amenities || amenities.length === 0) && (
                <p className="text-xs text-gray-400 italic col-span-2">
                  No amenities available
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              label="Cancel"
              onClick={closeModal}
              className="flex-1 h-11 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
            />
            <Button
              type="submit"
              label="Create Category"
              className="flex-1 h-11 bg-blue-600 text-white font-bold hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-200 transition-all"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoomTypeModel;
