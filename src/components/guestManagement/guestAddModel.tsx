import { useAppDispatch } from "@/hooks/useAppDispatch";
import { createGuest, fetchAllGuest } from "@/app/asyncThunk/guestThunk";
import { useForm } from "react-hook-form";
import {
  addGuestSchema,
  type addGuestInput,
} from "@/utils/schemas/addGuestSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

interface Props {
  closeModal: () => void;
}

const CreateGuestModal = ({ closeModal }: Props) => {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<addGuestInput>({
    resolver: zodResolver(addGuestSchema),
    defaultValues: {
      name: "",
      contact: "",
      email: "",
      idProof: "",
      address: "",
      emergencyContact: "",
    },
  });

  const onSubmit = async (data: addGuestInput) => {
    try {
      const resultAction = await dispatch(createGuest(data));

      if (createGuest.fulfilled.match(resultAction)) {
        toast.success("Guest created successfully!");
        await dispatch(fetchAllGuest());
        closeModal();
      } else {
        toast.error("Failed to create guest");
      }
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
        <div className="p-6 bg-slate-50 border-b rounded-2xl  border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Add New Guest</h2>
            <p className="text-slate-500 text-sm">
              Enter guest details for booking and stay records.
            </p>
          </div>

          <button
            onClick={closeModal}
            className="p-2 hover:bg-slate-200 rounded-full text-slate-400"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 flex flex-col gap-5 overflow-y-auto"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Guest Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="border px-4 py-2.5 rounded-xl border-slate-200"
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Contact Number
            </label>
            <input
              type="text"
              {...register("contact")}
              className="border px-4 py-2.5 rounded-xl border-slate-200"
            />
            {errors.contact && (
              <p className="text-red-500 text-xs">{errors.contact.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="border px-4 py-2.5 rounded-xl border-slate-200"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              ID Proof
            </label>
            <input
              type="text"
              placeholder="Aadhar / Passport / Driving License"
              {...register("idProof")}
              className="border px-4 py-2.5 rounded-xl border-slate-200"
            />
            {errors.idProof && (
              <p className="text-red-500 text-xs">{errors.idProof.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Address
            </label>
            <textarea
              {...register("address")}
              className="border px-4 py-2.5 rounded-xl border-slate-200"
            />
            {errors.address && (
              <p className="text-red-500 text-xs">{errors.address.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">
              Emergency Contact
            </label>
            <input
              type="text"
              {...register("emergencyContact")}
              className="border px-4 py-2.5 rounded-xl border-slate-200"
            />
            {errors.emergencyContact && (
              <p className="text-red-500 text-xs">
                {errors.emergencyContact.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-2.5 bg-slate-100 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-2.5 bg-blue-600 text-white rounded-xl"
            >
              {isSubmitting ? "Creating..." : "Create Guest"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGuestModal;