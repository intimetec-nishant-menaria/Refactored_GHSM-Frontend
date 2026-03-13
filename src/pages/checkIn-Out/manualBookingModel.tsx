import { useState, useEffect , useMemo} from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { createManualBooking } from "@/app/asyncThunk/bookingThunk";
import { fetchAvailableRooms } from "@/app/asyncThunk/availableRoomThunk";
import DateRangePicker from "@/components/Bookings/DateRangePicker"; 
import { manualBookingSchema, type ManualBookingData } from "@/utils/schemas/manualBookingSchema";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { useAppSelector } from "@/hooks/useAppSelector";
import GuestSearchField from "@/components/common/guestSearchDropDown/guestSearchField";

const ManualBookingModal = ({ closeModel }: { closeModel: () => void}) => {
  const dispatch = useAppDispatch();
  const { rooms } = useAppSelector((state) => state.availableRooms);
  const [loader, setLoader] = useState(false);

  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm<ManualBookingData>({
    resolver: zodResolver(manualBookingSchema),
    defaultValues: {
      guestId : 0,
      checkInDate: null,
      checkOutDate: null,
      roomTypeId : 0,
    }
  });

  const checkIn = useWatch({ control, name: "checkInDate" });
  const checkOut = useWatch({ control, name: "checkOutDate" });
  const roomTypeId = useWatch({ control, name: "roomTypeId" });

  const filteredRooms = useMemo(() => {
    if (roomTypeId === 0) return rooms; 
    return rooms.filter((r: any) => String(r.roomTypeId) === String(roomTypeId));
  }, [rooms, roomTypeId]);

  useEffect(() => {
    if (checkIn && checkOut) {
      const checkInDate = dayjs(checkIn).startOf('day').format('YYYY-MM-DD');
      const checkOutDate = dayjs(checkOut).startOf('day').format('YYYY-MM-DD');
      
      dispatch(fetchAvailableRooms({ checkInDate, checkOutDate })).unwrap();
    }
  }, [checkIn, checkOut, dispatch]);

  const onSubmit = async (data: ManualBookingData) => {
    setLoader(true);
    try {
      const payload = {
        ...data,
        checkInDate: dayjs(data.checkInDate).format('YYYY-MM-DD'),
        checkOutDate: dayjs(data.checkOutDate).format('YYYY-MM-DD'),
      };
      await dispatch(createManualBooking(payload)).unwrap();
      toast.success("Offline booking successful!");
      closeModel();
    } catch (err: any) {
      toast.error(err.message || "Booking failed");
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex justify-center items-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="p-6 bg-slate-50 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">New Offline Booking</h2>
          <button onClick={closeModel} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Select Stay Dates</label>
            <DateRangePicker 
              checkIn={checkIn as any} 
              checkOut={checkOut as any} 
              handleDateClick={(date) => {
                if (!checkIn || (checkIn && checkOut)) {
                  setValue("checkInDate", date as any);
                  setValue("checkOutDate", null);
                } else {
                  setValue("checkOutDate", date as any);
                }
              }} 
            />
            {(errors.checkInDate || errors.checkOutDate) && (
              <span className="text-red-500 text-xs italic">Please select a valid date range</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Room Type</label>
              <select 
                {...register("roomTypeId")} 
                className="border border-slate-200 p-3 rounded-xl bg-white focus:ring-2 focus:ring-blue-100 outline-none"
              >
                <option value={0}>All</option>
                <option value={1}>Single</option>
                <option value={2}>Double</option>
                <option value={3}>Suite</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Select Room</label>
              <select 
                {...register("roomId")} 
                disabled={!filteredRooms.length}
                className="border border-slate-200 p-3 rounded-xl bg-white focus:ring-2 focus:ring-blue-100 outline-none disabled:bg-slate-50"
              >
                <option value="">
                    {!roomTypeId 
                        ? "Select type first" 
                        : filteredRooms.length 
                            ? "Choose an available room" 
                            : "No rooms available for this type"}
                </option>
                {filteredRooms.map((r: any) => (
                  <option key={r.id} value={r.id}>Room {r.roomNumber}</option>
                ))}
              </select>
              {errors.roomId && <span className="text-red-500 text-xs italic">Please select a room</span>}
            </div>
          </div>
          <GuestSearchField onSelect={(id)=>setValue("guestId" , id)} error={errors.guestId?.message}/>

          <div className="flex justify-end gap-3 mt-4 pt-6 border-t border-slate-100">
            <button type="button" onClick={closeModel} className="px-6 py-2.5 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-all">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loader}
              className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:bg-blue-300"
            >
              {loader ? "Processing..." : "Complete Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualBookingModal;