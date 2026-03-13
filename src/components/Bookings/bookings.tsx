import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { fetchAvailableRooms } from "@/app/asyncThunk/availableRoomThunk";
import dayjs, { Dayjs } from "dayjs";
import DateRangePicker from "./DateRangePicker";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchRoomType } from "@/app/asyncThunk/roomTypeThunk";
import RoomCard from "../common/card/Card";
import Button from "../common/button/Button";
import LoginModel from "./loginModel";
import BookingSummary from "./bookingSummary";
import type { RoomTypesPayload } from "@/utils/interfaces/roomTypes";
import { createBooking } from "@/app/asyncThunk/bookingThunk";
import toast from "react-hot-toast";

function Bookings() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { roomTypes } = useAppSelector((state) => state.roomType);
  const { rooms, loading } = useAppSelector((state) => state.availableRooms);

  const [filter, setFilter] = useState(0);
  const [checkIn, setCheckIn] = useState<Dayjs | null>(null);
  const [checkOut, setCheckOut] = useState<Dayjs | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomTypesPayload | null>(
    null,
  );
  const [bookingStep, setBookingStep] = useState(1);
  const [isRedirectToLoginModelOpen, setLoginModel] = useState(false);

  useEffect(() => {
    dispatch(fetchRoomType());
  }, [dispatch]);

  const availableRooms = useMemo(() => {
    if (filter === 0) return rooms;
    return rooms.filter((room) => room.roomTypeId === filter);
  }, [filter, rooms]);

  useEffect(() => {
    if (!checkIn || !checkOut) return;

    dispatch(
      fetchAvailableRooms({
        checkInDate: dayjs(checkIn).format("YYYY-MM-DD"),
        checkOutDate: dayjs(checkOut).format("YYYY-MM-DD"),
      }),
    );
  }, [checkIn, checkOut, dispatch]);

  const handleDateClick = (newValue: Dayjs | null) => {
    if (!newValue) return;
    console.log(dayjs(newValue).format("YYYY-MM-DD"));
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(newValue);
      setCheckOut(null);
      return;
    }
    if (newValue.isBefore(checkIn)) {
      setCheckIn(newValue);
      setCheckOut(null);
    } else {
      setCheckOut(newValue);
    }
  };

  function handleContinue() {
    if (!user) {
      setLoginModel(true);
      return;
    }
    setBookingStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function onConfirmBooking() {
    try {
      if (!selectedRoom || !user || !checkIn || !checkOut) return;
      console.log(dayjs(checkIn).toISOString());
      await dispatch(
        createBooking({
          roomId: selectedRoom.id,
          userId: user.id,
          checkInDate: dayjs(checkIn).toISOString(),
          checkOutDate: dayjs(checkOut).toISOString(),
        }),
      ).unwrap();

      toast.success("Booking confirmed successfully!");
      setBookingStep(1);
      setSelectedRoom(null);
      setCheckIn(null);
      setCheckOut(null);
    } catch (error: any) {
      toast.error(error?.message || "Booking failed.");
    }
  }

  const continueDisabled = !checkIn || !checkOut || !selectedRoom || loading;

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8 pt-6 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-800">
              Room Booking
            </h1>
            {bookingStep === 2 && (
              <button
                onClick={() => setBookingStep(1)}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                ← Change Selection
              </button>
            )}
          </div>
          <div className="flex gap-4 text-xs md:text-sm font-medium pt-2">
            <div
              className={`px-4 py-1.5 rounded-full transition-colors ${bookingStep === 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
            >
              1. Select Room
            </div>
            <div
              className={`px-4 py-1.5 rounded-full transition-colors ${bookingStep === 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
            >
              2. Confirm
            </div>
          </div>
        </div>

        {bookingStep === 1 ? (
          <>
            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex flex-col lg:flex-row gap-6 lg:items-end">
                <div className="flex-1 w-full overflow-x-auto">
                  <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">
                    Select Dates
                  </label>
                  <DateRangePicker
                    checkIn={checkIn}
                    checkOut={checkOut}
                    handleDateClick={handleDateClick}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 lg:w-auto">
                  <div className="flex-1 sm:w-64">
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">
                      Room Category
                    </label>
                    <select
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        setFilter(Number(e.target.value))
                      }
                      value={filter}
                      className="w-full border px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white outline-none"
                    >
                      <option value={0}>All Room Types</option>
                      {roomTypes.map((rt) => (
                        <option key={rt.id} value={rt.id}>
                          {rt.roomTypeName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="hidden sm:block">
                    <Button
                      disabled={continueDisabled}
                      label="Continue"
                      onClick={handleContinue}
                      className="px-8 py-2.5 mt-5.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-gray-300 font-bold transition-all h-[46px]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full py-20 text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500 font-medium">
                    Checking availability...
                  </p>
                </div>
              ) : availableRooms.length === 0 ? (
                <div className="col-span-full py-20 bg-white rounded-xl border-2 border-dashed border-gray-200 text-center">
                  <p className="text-gray-400 font-medium">
                    No rooms available for these dates.
                  </p>
                  <p className="text-sm text-gray-400">
                    Try adjusting your dates or room type filter.
                  </p>
                </div>
              ) : (
                availableRooms.map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    isSelected={selectedRoom?.id === room.id}
                    onSelect={setSelectedRoom}
                  />
                ))
              )}
            </div>
            <div className="lg:hidden md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-30">
              <Button
                disabled={continueDisabled}
                label={!selectedRoom ? "Select a Room" : "Continue to Booking"}
                onClick={handleContinue}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold disabled:bg-gray-200 disabled:text-gray-400"
              />
            </div>
          </>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <BookingSummary
              selectedRoom={selectedRoom}
              checkIn={checkIn}
              checkOut={checkOut}
              onConfirmBooking={onConfirmBooking}
            />
          </div>
        )}

        {isRedirectToLoginModelOpen && (
          <LoginModel setLoginModel={setLoginModel} />
        )}
      </div>
    </div>
  );
}

export default Bookings;
