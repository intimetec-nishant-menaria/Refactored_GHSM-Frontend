import { useState } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { updateUser, fetchUsers } from "@/app/asyncThunk/userThunk";
import type { User } from "@/utils/interfaces/user";
import type { UpdateModelProps } from "@/utils/interfaces/updateModel";

const UpdateUserModal = ({ closeModel, data }: UpdateModelProps<User>) => {
  const dispatch = useAppDispatch();

  const [name, setName] = useState(data.name);
  const [email] = useState(data.email);
  const [role, setRole] = useState(data.role);
  const [isActive, setIsActive] = useState(data.isActive);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.length < 1) {
      setError(true);
      return;
    }
    setError(false);

    await dispatch(
      updateUser({
        id: data.id,
        name,
        email,
        role,
        isActive,
      }),
    );

    await dispatch(fetchUsers());

    closeModel();
  };

  return (
    <div className="absolute top-0 right-0 mt-12 mr-4 w-96 bg-white p-6 rounded-lg shadow-lg z-50">
      <h2 className="text-xl font-bold mb-4">Update User</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-3 py-2 rounded"
        />
        {error == true ? "Name should not be empty" : ""}
        <input
          type="email"
          value={email}
          disabled
          className="border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(Number(e.target.value))}
          className="border px-3 py-2 rounded"
        >
          <option value={1}>Admin</option>
          <option value={2}>Staff</option>
        </select>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Active
        </label>

        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={closeModel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ✓
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateUserModal;
