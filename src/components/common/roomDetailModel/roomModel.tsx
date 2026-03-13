import type { RoomType } from "@/utils/interfaces/roomTypes";

interface RoomModalProps {
  room: RoomType | null;
  isOpen: boolean;
  onClose: () => void;
}

const RoomModal = ({ room, isOpen, onClose }: RoomModalProps) => {
  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/0">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{room.roomTypeName}</h2>
        <p className="text-gray-600 mb-2">
          Capacity: <span className="font-medium">{room.capacity} Guests</span>
        </p>
        <p className="text-gray-600 mb-2">
          Price/Night: <span className="font-medium">₹{room.pricePerNight}</span>
        </p>

        {room.amenities && room.amenities.length > 0 && (
          <div className="mb-4">
            <h3 className="text-gray-800 font-medium mb-2">Amenities:</h3>
            <div className="flex flex-wrap gap-2">
              {room.amenities.map((amenity, idx) => (
                <span
                  key={idx}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RoomModal;