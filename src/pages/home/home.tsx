import { useEffect, useState } from "react";
import Bookings from "@/components/Bookings/bookings";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { fetchRoomType } from "@/app/asyncThunk/roomTypeThunk";
import toast from "react-hot-toast";
import type { RoomType } from "@/utils/interfaces/roomTypes";
import RoomModal from "@/components/common/roomDetailModel/roomModel";

function Home() {
  const { user } = useAppSelector((state) => state.auth);
  const { roomTypes, loading } = useAppSelector((state) => state.roomType);
  const dispatch = useAppDispatch();

  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [isRoomModalOpen, setRoomModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchRoomType());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const hasWelcomed = sessionStorage.getItem("welcomed");
      if (!hasWelcomed) {
        toast.success(`Welcome back, ${user.name}! 👋`, { duration: 3000 });
        sessionStorage.setItem("welcomed", "true");
      }
    }
  }, [user]);

  const handleRoomClick = (room: RoomType) => {
    setSelectedRoom(room);
    setRoomModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedRoom(null);
    setRoomModalOpen(false);
  };
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <section>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
          Rooms We Offer
        </h2>

        {loading && <p>Loading room types...</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {roomTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => handleRoomClick(type)}
              className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6"
            >
              <h3 className="text-xl font-semibold mb-2">
                {type.roomTypeName}
              </h3>
              <p className="text-gray-600 mb-2">
                Capacity: {type.capacity} Guests
              </p>
              <div className="text-blue-600 font-bold text-lg">
                ₹{type.pricePerNight}
                <span className="text-sm text-gray-500 font-normal">
                  {" "}
                  / night
                </span>
              </div>
              <button className="mt-4 text-sm text-blue-600 font-medium hover:underline">
                View Details →
              </button>
            </div>
          ))}
        </div>
      </section>
      <section>
        <Bookings />
      </section>
      <RoomModal
          room={selectedRoom}
          isOpen={isRoomModalOpen}
          onClose={handleCloseModal}
        />
    </div>
  );
}

export default Home;
