import dayjs, { Dayjs } from "dayjs";
import Button from "../common/button/Button";
import type { RoomTypesPayload } from "@/utils/interfaces/roomTypes";
import { useAppSelector } from "@/hooks/useAppSelector";

interface Props {
  checkIn: Dayjs | null;
  checkOut: Dayjs | null;
  selectedRoom: RoomTypesPayload | null;
  onConfirmBooking: () => void;
}

function BookingSummary({ selectedRoom, checkIn, checkOut, onConfirmBooking }: Props) {
  const { user } = useAppSelector((state) => state.auth);

  if (!selectedRoom || !checkIn || !checkOut) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md text-center text-gray-500 border border-gray-100">
        Please select a room and dates to see the booking summary.
      </div>
    );
  }

  const nights = dayjs(checkOut).diff(dayjs(checkIn), "day") || 1;
  const totalPrice = selectedRoom.pricePerNight * nights;

  return (
    <div className="w-full max-w-5xl mx-auto bg-white shadow-xl md:shadow-2xl rounded-2xl border border-gray-100 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="flex-1 p-6 md:p-8 space-y-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Booking Summary
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Review your details before confirming
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-4">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">
                Guest Details
              </h3>
              <div className="flex justify-between md:flex-col lg:flex-row text-sm gap-1">
                <span className="text-gray-500">Name</span>
                <span className="font-medium text-right md:text-left lg:text-right">{user?.name}</span>
              </div>
              <div className="flex justify-between md:flex-col lg:flex-row text-sm gap-1">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-right md:text-left lg:text-right break-all">{user?.email}</span>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-700 border-b pb-1">
                Stay Details
              </h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Check-in</span>
                <span className="font-medium">{dayjs(checkIn).format("MMM DD, YYYY")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Check-out</span>
                <span className="font-medium">{dayjs(checkOut).format("MMM DD, YYYY")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Nights</span>
                <span className="font-medium">{nights}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-80 lg:w-96 bg-blue-50 p-6 md:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-blue-100">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Room Details
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Room Number</span>
                <span className="font-bold">{selectedRoom.roomNumber}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Room Type</span>
                <span className="font-medium">{selectedRoom.roomTypeName}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price / Night</span>
                <span className="font-medium">${selectedRoom.pricePerNight}</span>
              </div>
            </div>

            <div className="border-t border-blue-200 pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Total Amount</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${totalPrice}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1 text-right italic">
                Taxes and fees included
              </p>
            </div>
          </div>

          <div className="mt-8">
            <Button
              label="Confirm Booking"
              onClick={onConfirmBooking}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
            />
            <p className="text-center text-xs text-gray-400 mt-4">
              By clicking, you agree to our terms and conditions.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default BookingSummary;