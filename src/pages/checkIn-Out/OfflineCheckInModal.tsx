import { useEffect, useState } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchAvailableRooms } from "@/app/asyncThunk/availableRoomThunk";
import dayjs, { Dayjs } from "dayjs";
import Button from "@/components/common/button/Button";
import DateRangePicker from "@/components/Bookings/DateRangePicker";
import toast from "react-hot-toast";

interface OfflineCheckInModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const OfflineCheckInModal = ({
  onClose,
  onSuccess,
}: OfflineCheckInModalProps) => {
  const dispatch = useAppDispatch();
  const { rooms: availableRooms, loading: roomsLoading } = useAppSelector(
    (state) => state.availableRooms,
  );

  const [guest, setGuest] = useState({ name: "", phone: "" });
  const [checkIn, setCheckIn] = useState<Dayjs | null>(dayjs());
  const [checkOut, setCheckOut] = useState<Dayjs | null>(dayjs().add(1, "day"));
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);

  useEffect(() => {
    if (checkIn && checkOut && checkOut.isAfter(checkIn)) {
      dispatch(
        fetchAvailableRooms({
          checkInDate: checkIn.toISOString(),
          checkOutDate: checkOut.toISOString(),
        }),
      );
    }
  }, [checkIn, checkOut, dispatch]);

  const handleDateChange = (date: Dayjs | null) => {
    setCheckIn(date);
    if (date && checkOut && date.isAfter(checkOut)) {
      setCheckOut(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomId || !guest.name) return;

    try {
      toast.success("Offline booking confirmed!");
      onSuccess();
      onClose();
    } catch {
      toast.error("Failed to create booking");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-blue-700 p-4 text-white flex justify-between items-center">
          <h3 className="font-bold text-lg">Create Offline Booking</h3>
          <button onClick={onClose} className="text-2xl">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Guest Name
              </label>
              <input
                required
                className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter guest name"
                value={guest.name}
                onChange={(e) => setGuest({ ...guest, name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">
                Phone Number
              </label>
              <input
                required
                className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Guest contact"
                value={guest.phone}
                onChange={(e) => setGuest({ ...guest, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Select Stay Period
            </label>
            <DateRangePicker
              checkIn={checkIn}
              checkOut={checkOut}
              handleDateClick={handleDateChange}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Assign Room
            </label>
            <select
              required
              className="w-full border p-3 rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedRoomId || ""}
              onChange={(e) => setSelectedRoomId(Number(e.target.value))}
            >
              <option value="" disabled>
                {roomsLoading
                  ? "Fetching rooms..."
                  : "Choose an available room"}
              </option>
              {availableRooms.map((room) => (
                <option key={room.id} value={room.id}>
                  Room {room.roomNumber} - {room.roomTypeName} ($
                  {room.pricePerNight}/night)
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <Button
              type="button"
              label="Cancel"
              onClick={onClose}
              className="flex-1 border"
            />
            <Button
              type="submit"
              label="Check-in Now"
              disabled={!selectedRoomId || roomsLoading}
              className="flex-1 bg-blue-600 text-white font-bold"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default OfflineCheckInModal;
