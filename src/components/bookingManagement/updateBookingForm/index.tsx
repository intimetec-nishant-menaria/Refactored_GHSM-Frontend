import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Input from "../../common/input/Input";
import DateRangePicker from "@/components/common/DateRangePicker/DateRangePicker";
import { useUpdateBookingMutation } from "@/app/Api's/booking";
import { useLazyGetAllAvailableRoomsQuery } from "@/app/Api's/availableRoom";
import type { UpdateModelProps } from "@/utils/interfaces/updateModel";
import { BookingSchema, type BookingInput } from "@/utils/schemas/addBookings";
import dayjs from "dayjs";
import type { RoomData } from "@/utils/interfaces/room";
import type { BookingPayload } from "@/utils/interfaces/booking";

const UpdateBookingForm = ({ data, closeModel }: UpdateModelProps<BookingPayload>) => {
  const [updateBooking] = useUpdateBookingMutation();
  const [fetchRooms, { data: availableRooms, isLoading: loadingRooms }] = useLazyGetAllAvailableRoomsQuery();
  console.log(data);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      bugId: data.bugId, 
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      gender: data.gender,
      roomId: data.roomId,
      checkInDate: dayjs(data.checkInDate),
      checkOutDate: dayjs(data.checkOutDate),
    },
  });

  const selectedGender = watch("gender");
  const checkIn = watch("checkInDate");
  const checkOut = watch("checkOutDate");

  useEffect(() => {
    if (selectedGender && checkIn && checkOut && checkOut.isAfter(checkIn)) {
      fetchRooms({
        gender: selectedGender,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
      });
    }
  }, [selectedGender, checkIn, checkOut, fetchRooms]);

  const handleDateClick = (date: any) => {
    if (!checkIn || (checkIn && checkOut)) {
      setValue("checkInDate", date!, { shouldValidate: true });
      setValue("checkOutDate", null as any);
    } else {
      setValue("checkOutDate", date!, { shouldValidate: true });
    }
  };

  const onSubmit = async (formData: BookingInput) => {
    try {
      const payload = {
        id: data.id, 
        ...formData,
      };
      await updateBooking(payload).unwrap();
      toast.success("Booking updated successfully!");
      closeModel();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update booking");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-black uppercase tracking-widest text-slate-400 ml-1">
          Bug / Reference ID
        </label>
        <Input 
          {...register("bugId")} 
          error={!!errors.bugId} 
          placeholder="System Bug ID" 
          className="bg-slate-50/50"
        />
        {errors.bugId && (
          <span className="text-xs text-red-500 font-medium italic">
            {errors.bugId.message}
          </span>
        )}
      </div>

      <hr className="border-slate-100 my-1" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Guest Name</label>
          <Input 
            {...register("guestName")} 
            error={!!errors.guestName} 
            placeholder="Full Name" 
          />
          {errors.guestName && (
            <span className="text-xs text-red-500 font-medium italic">
              {errors.guestName.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Guest Email</label>
          <Input 
            {...register("guestEmail")} 
            error={!!errors.guestEmail} 
            placeholder="email@example.com" 
          />
          {errors.guestEmail && (
            <span className="text-xs text-red-500 font-medium italic">
              {errors.guestEmail.message}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-slate-700">Booking Dates</label>
        <DateRangePicker
          checkIn={checkIn}
          checkOut={checkOut}
          handleDateClick={handleDateClick}
          allowPast={false}
        />
        {errors.checkOutDate && (
          <span className="text-xs text-red-500 font-medium italic">
            {errors.checkOutDate.message}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Guest Gender</label>
          <select
            {...register("gender", { valueAsNumber: true })}
            className="border border-slate-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white transition-all shadow-sm text-sm font-medium h-[46px]"
          >
            <option value={0}>-- Select Gender --</option>
            <option value={1}>Female</option>
            <option value={2}>Male</option>
            <option value={3}>Other</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700 flex justify-between">
            Available Room 
            {loadingRooms && <span className="text-[10px] text-blue-500 animate-pulse uppercase">Updating...</span>}
          </label>
          <select
            {...register("roomId", { valueAsNumber: true })}
            disabled={loadingRooms}
            className={`border p-3 rounded-xl outline-none transition-all bg-white shadow-sm text-sm font-medium h-[46px] ${
              errors.roomId ? "border-red-400" : "border-slate-200 focus:ring-2 focus:ring-blue-500"
            }`}
          >
            <option value={0}>-- Select Room --</option>
            {availableRooms?.map((room: RoomData) => (
              <option key={room.id} value={room.id}>
                Room {room.roomNumber} {room?.CurrentOccupancy ? "(Currently Occupied)" : "(Empty)"}
              </option>
            ))}
            {!availableRooms?.find(r => r.id === data.roomId) && (
                <option value={data.roomId}>Room {data.roomNumber} (Current Selection)</option>
            )}
          </select>
          {errors.roomId && (
            <span className="text-xs text-red-500 font-medium italic">
              {errors.roomId.message}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 pt-6 mt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={closeModel}
          className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || loadingRooms}
          className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:bg-indigo-300"
        >
          {isSubmitting ? "Saving..." : "Update Booking"}
        </button>
      </div>
    </form>
  );
};

export default UpdateBookingForm;