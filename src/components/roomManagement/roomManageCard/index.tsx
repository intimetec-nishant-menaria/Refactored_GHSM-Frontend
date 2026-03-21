import type { RoomTypesPayload } from "@/utils/interfaces/roomTypes";

interface Props {
  rooms: RoomTypesPayload[];
}

const RoomManageCards = ({ rooms }: Props) => {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Room Details: </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white shadow-md rounded-xl p-6 flex flex-col items-start"
          >
            <h3 className="font-semibold text-xl">{room.roomTypeName}</h3>

            <p>Price Per Night: ₹{room.pricePerNight}</p>
            <p>Capacity: {room.capacity}</p>
            <p>Amenities: [{room.amenities.join(", ")}]</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default RoomManageCards;
