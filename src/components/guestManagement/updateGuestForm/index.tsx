import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { GuestState } from "@/utils/interfaces/guest";
import type { UpdateModelProps } from "@/utils/interfaces/updateModel";
import { updateGuestSchema, type GuestFormData } from "@/utils/schemas/updateGuest";
import toast from "react-hot-toast";
import { useUpdateGuestMutation } from "@/app/Api's/guest";

const UpdateGuestForm = ({ closeModel, data }: UpdateModelProps<GuestState>) => {
  const [loading, setLoading] = useState(false);
  const [updateGuest] = useUpdateGuestMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestFormData>({
    resolver: zodResolver(updateGuestSchema),
    defaultValues: {
      name: data.name,
      email: data.email,
      contact: data.contact,
      idProof: data.idProof,
      Address: data.address,
      emergencyContact: data.emergencyContact,
    },
  });

  const onSubmit = async (formData: GuestFormData) => {
    setLoading(true);
    try {
       await updateGuest({
          id: data.id,
          ...formData,
        });

        toast.success("Guest updated successfully");
        closeModel();
    } catch (err) {
      toast.error(err?.data.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return(
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 max-h-[80vh] overflow-y-auto flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <input
                {...register("name")}
                className={`border px-4 py-2 rounded-xl outline-none focus:ring-2 transition-all ${
                  errors.name ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:ring-blue-100"
                }`}
              />
              {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <input
                {...register("email")}
                className={`border px-4 py-2 rounded-xl outline-none focus:ring-2 transition-all ${
                  errors.email ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:ring-blue-100"
                }`}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Contact Number</label>
              <input
                {...register("contact")}
                className="border border-slate-200 px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
              />
              {errors.contact && <span className="text-red-500 text-xs">{errors.contact.message}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Emergency Contact</label>
              <input
                {...register("emergencyContact")}
                className="border border-slate-200 px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
              />
              {errors.emergencyContact && <span className="text-red-500 text-xs">{errors.emergencyContact.message}</span>}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">ID Proof Details</label>
            <input
              {...register("idProof")}
              className="border border-slate-200 px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none"
            />
            {errors.idProof && <span className="text-red-500 text-xs">{errors.idProof.message}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Residential Address</label>
            <textarea
              {...register("Address")}
              rows={3}
              className="border border-slate-200 px-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-100 outline-none resize-none"
            />
            {errors.Address && <span className="text-red-500 text-xs">{errors.Address.message}</span>}
          </div>
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={closeModel}
              className="px-6 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:bg-indigo-300"
            >
              {loading ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
  );
};

export default UpdateGuestForm;