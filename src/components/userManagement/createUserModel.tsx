import { useState } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { createUser, fetchUsers } from "@/app/asyncThunk/userThunk";

interface Props {
  closeModal: () => void;
}

const CreateUserModal = ({ closeModal }: Props) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRoleId] = useState(3);
  const [isActive, setIsActive] = useState(true);
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.length < 1) {
      setName("Name is not Valid");
      return;
    }
    await dispatch(createUser({ name, email, role, isActive, password }));
    dispatch(fetchUsers());
    closeModal();
  };

  return (
    <div className="absolute top-0 right-0 mt-12 mr-4 w-96 bg-white p-6 rounded-lg shadow-lg z-50">
      <h2 className="text-xl font-bold mb-4">Create User</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Name"
          className="border px-3 py-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          className="border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="number"
          placeholder="Role ID"
          className="border px-3 py-2 rounded"
          value={role}
          onChange={(e) => setRoleId(Number(e.target.value))}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border px-3 py-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
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
            onClick={closeModal}
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

export default CreateUserModal;
