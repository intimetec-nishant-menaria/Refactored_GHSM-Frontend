import type { RoomTypesPayload } from "@/utils/interfaces/roomTypes";
import clsx from "clsx";

interface RoomCardProps {
  room: RoomTypesPayload;
  isSelected?: boolean;
  onSelect: (room: RoomTypesPayload) => void;
}

function RoomCard({ room, isSelected = false, onSelect }: RoomCardProps) {
  const handleSelect = () => {
    onSelect(room);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      handleSelect();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
      aria-pressed={isSelected}
      className={clsx(
        "cursor-pointer m-1 sm:m-2 rounded-2xl bg-white p-3 sm:p-5 shadow-sm transition-all duration-200 border",
        "hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-300",
        isSelected
          ? "border-blue-600 ring-2 ring-blue-200"
          : "border-gray-200"
      )}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 space-y-2 sm:space-y-0">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
          Room {room.roomNumber}
        </h3>
        <span className="text-xs sm:text-sm px-2 py-1 rounded-full bg-gray-100 text-gray-600">
          {room.roomTypeName}
        </span>
      </div>

      <div className="text-sm sm:text-base text-gray-600 space-y-1">
        <p>
          <span className="font-medium text-gray-800">Capacity:</span>{" "}
          {room.capacity} Guests
        </p>
      </div>
      <div className="mt-3 sm:mt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
        <div className="text-blue-600 font-semibold text-lg sm:text-xl">
          ₹{room.pricePerNight.toLocaleString("en-IN")}
          <span className="text-sm text-gray-500 font-normal"> / night</span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation(); 
            handleSelect();
          }}
          className={clsx(
            "px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-colors duration-200",
            isSelected
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-blue-600 hover:text-white"
          )}
        >
          {isSelected ? "Selected" : "Select"}
        </button>
      </div>
    </div>
  );
}

export default RoomCard;