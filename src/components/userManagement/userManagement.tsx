import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "@/app/asyncThunk/userThunk";
import type { RootState } from "@/app/store/store";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import Button from "@/components/common/button/Button";
import deleteIcon from "@/assets/deleteIcon.png";
import editIcon from "@/assets/editIcon.png";
import CreateUserModal from "@/components/userManagement/createUserModel";
import UpdateUserModal from "@/components/userManagement/updateUserModel";
import type { User } from "@/utils/interfaces/user";

const UserManagement = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.user,
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);
  const openUpdateModal = (user: User) => setEditingUser(user);
  const closeUpdateModal = () => setEditingUser(null);

  const handleDelete = async (userId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await dispatch(deleteUser(userId));
      await dispatch(fetchUsers());
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between m-1.5 items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">User Management</h1>
        <Button
          onClick={openCreateModal}
          label="Add User"
          className="w-32 h-10 px-3 py-1 text-sm bg-blue-600 text-white font-bold rounded hover:bg-blue-700"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">Role</th>
              <th className="py-2 px-4">Active</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{user.name}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">
                  {user.role == 1 ? "Admin" : "Staff"}
                </td>
                <td className="py-2 px-4">{user.isActive ? "Yes" : "No"}</td>
                <td className="py-2 px-4 flex gap-2">
                  <img
                    src={deleteIcon}
                    alt="Delete"
                    className="cursor-pointer w-5 h-5"
                    onClick={() => handleDelete(user.id)}
                  />
                  /
                  <img
                    src={editIcon}
                    alt="Update"
                    className="cursor-pointer w-5 h-5"
                    onClick={() => openUpdateModal(user)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isCreateModalOpen && <CreateUserModal closeModel={closeCreateModal} />}

      {editingUser && (
        <UpdateUserModal closeModel={closeUpdateModal} user={editingUser} />
      )}
    </div>
  );
};

export default UserManagement;
