import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import Input from "../../common/input/Input";
import DateRangePicker from "@/components/common/DateRangePicker/DateRangePicker";
import { useCreateBookingMutation } from "@/app/Api's/booking";
import { useLazyGetAllAvailableRoomsQuery } from "@/app/Api's/availableRoom";
import { BookingSchema, type BookingInput } from "@/utils/schemas/addBookings";
import type { Dayjs } from "dayjs";

interface Props {
  closeModel: () => void;
}

const AddBookingForm = ({ closeModel }: Props) => {
  const [createBooking] = useCreateBookingMutation();
  const [fetchRooms, { data: availableRooms, isLoading: loadingRooms }] = useLazyGetAllAvailableRoomsQuery();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingInput>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      gender: 0,
      roomId: 0,
    },
  });

  const selectedGender = watch("gender");
  const checkIn = watch("checkInDate");
  const checkOut = watch("checkOutDate");

  useEffect(() => {
    if (selectedGender && checkIn && checkOut) {
      fetchRooms({
        gender: selectedGender,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
      });
      setValue("roomId", 0);
    }
  }, [selectedGender, checkIn, checkOut, fetchRooms, setValue]);

  const handleCheckInClick = (newDate: Dayjs | null) => {
    if (!newDate) return;
    setValue("checkInDate", newDate, { shouldValidate: true });
    if (checkOut && newDate.isAfter(checkOut)) {
      setValue("checkOutDate", null as unknown as Dayjs, { shouldValidate: true });
    }
  };

  const handleCheckOutClick = (newDate: Dayjs | null) => {
    if (!newDate) return;
    if (checkIn && newDate.isBefore(checkIn)) {
      setValue("checkInDate", newDate, { shouldValidate: true });
      setValue("checkOutDate", null as unknown as Dayjs, { shouldValidate: true });
    } else {
      setValue("checkOutDate", newDate, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: BookingInput) => {
    try {
      await createBooking(data).unwrap();
      toast.success("Booking created successfully!");
      closeModel();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create booking");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-5 bg-surface">
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-black uppercase tracking-widest text-text-muted/60 ml-1">
          Bug / Reference ID
        </label>
        <Input 
          {...register("bugId", { valueAsNumber: true }) } 
          placeholder="Enter System Bug ID" 
          className="bg-layout/10"
        />
        {errors.bugId && (
          <span className="text-xs text-danger font-medium italic">
            {errors.bugId.message}
          </span>
        )}
      </div>

      <hr className="border-muted my-1" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-text-main">Guest Name</label>
          <Input 
            {...register("guestName")} 
            placeholder="Full Name" 
            className="bg-layout/10"
          />
          {errors.guestName && (
            <span className="text-xs text-danger font-medium italic">
              {errors.guestName.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-text-main">Guest Email</label>
          <Input 
            {...register("guestEmail")} 
            placeholder="email@example.com" 
            className="bg-layout/10"
          />
          {errors.guestEmail && (
            <span className="text-xs text-danger font-medium italic">
              {errors.guestEmail.message}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-text-main">Booking Dates</label>
        <DateRangePicker
          checkIn={checkIn}
          checkOut={checkOut}
          handleCheckInClick={handleCheckInClick}
          handleCheckOutClick={handleCheckOutClick}
          allowPast={false}
        />
        {errors.checkOutDate && (
          <span className="text-xs text-danger font-medium italic">
            {errors.checkOutDate.message as string}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-text-main">Guest Gender</label>
          <select
            {...register("gender", { valueAsNumber: true })}
            className="border border-border p-3 rounded-xl focus:ring-4 focus:ring-primary/5 outline-none bg-layout/10 text-text-main transition-all text-sm font-bold cursor-pointer"
          >
            <option value={0}>-- Select Gender --</option>
            <option value={1}>Female</option>
            <option value={2}>Male</option>
            <option value={3}>Other</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-text-main flex justify-between">
            Available Room 
            {loadingRooms && <span className="text-[10px] text-primary animate-pulse font-black uppercase">Updating...</span>}
          </label>
          <select
            {...register("roomId", { valueAsNumber: true })}
            disabled={loadingRooms}
            className={`border p-3 rounded-xl outline-none transition-all bg-layout/10 text-text-main text-sm font-bold cursor-pointer shadow-sm ${
              errors.roomId ? "border-danger" : "border-border focus:ring-4 focus:ring-primary/5"
            }`}
          >
            <option value={0}>-- Select Room --</option>
            {availableRooms?.map((room: any) => (
              <option key={room.id} value={room.id}>
                Room {room.roomNumber} ({room.currentOccupancy} Occupants)
              </option>
            ))}
          </select>
          {errors.roomId && (
            <span className="text-xs text-danger font-medium italic">
              {errors.roomId.message}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 pt-6 mt-4 border-t border-muted">
        <button
          type="button"
          onClick={closeModel}
          className="flex-1 px-4 py-3 bg-muted text-text-muted font-bold rounded-xl hover:bg-border transition-all active:scale-95"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || loadingRooms}
          className="flex-1 px-4 py-3 bg-primary text-surface font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:bg-primary/40"
        >
          {isSubmitting ? "Finalizing..." : "Create Booking"}
        </button>
      </div>
    </form>
  );
};

export default AddBookingForm;