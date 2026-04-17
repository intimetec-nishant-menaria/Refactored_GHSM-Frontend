import { useForm } from "react-hook-form";
import {
  UserSchema,
  type UserInput,
} from "@/utils/schemas/User";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useCreateUserMutation } from "@/app/Api/user";

const CreateUserForm = ({ closeModel }: { closeModel: () => void }) => {
  const [createUser] = useCreateUserMutation();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserInput>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Guard",
      password: "",
      isActive: true,
    },
  });

  const onSubmit = async (data: UserInput) => {
    try {
      await createUser(data).unwrap();
      toast.success("User created successfully!");
      closeModel();
    } catch (err: any) {
      console.log(err);
      toast.error(err?.data.message || "An unexpected error occurred");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-8 flex flex-col gap-5 bg-surface"
    >
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="name"
          className="text-sm font-semibold text-text-main"
        >
          Full Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="John Doe"
          className={`border px-4 py-2.5 rounded-xl outline-none focus:ring-2 transition-all bg-layout/10 text-text-main ${
            errors.name 
              ? "border-danger focus:ring-danger/10" 
              : "focus:ring-primary/10 border-border"
          }`}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-danger text-xs font-medium italic">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-sm font-semibold text-text-main"
        >
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="john@example.com"
          className={`border px-4 py-2.5 rounded-xl outline-none focus:ring-2 transition-all bg-layout/10 text-text-main ${
            errors.email 
              ? "border-danger focus:ring-danger/10" 
              : "focus:ring-primary/10 border-border"
          }`}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-danger text-xs font-medium italic">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 flex flex-col gap-1.5">
          <label
            htmlFor="role"
            className="text-sm font-semibold text-text-main"
          >
            Assign Role
          </label>
          <select
            id="role"
            {...register("role")}
            className="border border-border p-2.5 rounded-xl focus:ring-2 focus:ring-primary/10 bg-layout/10 text-text-main outline-none cursor-pointer"
          >
            <option value={"Admin"}>Admin</option>
            <option value={"HR"}>HR</option>
            <option value={"Guard"}>Guard</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5 justify-end pb-3">
          <label className="flex items-center gap-3 cursor-pointer p-2 rounded-xl hover:bg-layout transition-colors">
            <input
              type="checkbox"
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary/30"
              {...register("isActive")}
            />
            <span className="text-sm font-semibold text-text-main">
              Account Active
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-sm font-semibold text-text-main"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          className={`border px-4 py-2.5 rounded-xl outline-none focus:ring-2 transition-all bg-layout/10 text-text-main ${
            errors.password 
              ? "border-danger focus:ring-danger/10" 
              : "focus:ring-primary/10 border-border"
          }`}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-danger text-xs font-medium italic">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-muted">
        <button
          type="button"
          onClick={closeModel}
          className="px-6 py-2.5 bg-muted text-text-muted font-bold rounded-xl hover:bg-border transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-2.5 bg-primary text-surface font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:bg-primary/40 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating..." : "Create User"}
        </button>
      </div>
    </form>
  );
};

export default CreateUserForm;