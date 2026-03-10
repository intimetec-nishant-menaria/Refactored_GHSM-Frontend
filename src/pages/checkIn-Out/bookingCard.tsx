import Button from "@/components/common/button/Button";
import dayjs from "dayjs";

interface BookingCardProps {
  booking:any;
  activeTab: "checkin" | "checkout";
  onAction: (id: number, status: string) => void;
}

const BookingCard = ({ booking, activeTab, onAction }: BookingCardProps) => {
  const isArrival = activeTab === "checkin";
  const nights =
    dayjs(booking.checkOutDate).diff(dayjs(booking.checkInDate), "day") || 1;

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 lg:hidden">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded uppercase">
            Room {booking.roomNumber}
          </span>
          <h3 className="text-lg font-bold text-gray-800 mt-1">
            {booking.guestName}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-gray-900">
            ${booking.pricePerNight}/nt
          </p>
          <p className="text-[10px] text-gray-500 uppercase">
            {booking.roomTypeName}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs py-3 border-y border-gray-50 mb-4">
        <p>
          <span className="text-gray-400 block uppercase font-bold">In</span>{" "}
          {dayjs(booking.checkInDate).format("DD MMM")}
        </p>
        <p>
          <span className="text-gray-400 block uppercase font-bold">Out</span>{" "}
          {dayjs(booking.checkOutDate).format("DD MMM")}
        </p>
      </div>

      <Button
        label={isArrival ? "Check Out" : "Settle & Complete"}
        onClick={() =>
          onAction(booking.id, isArrival ? "checked-out" : "completed")
        }
        className={`w-full py-2.5 rounded-lg font-bold text-white ${isArrival ? "bg-amber-500 hover:bg-amber-600" : "bg-green-600 hover:bg-green-700"}`}
      />
    </div>
  );
};

export default BookingCard;
