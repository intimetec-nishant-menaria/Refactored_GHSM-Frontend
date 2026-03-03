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
      dispatch(fetchUsers());
    }
  };

  if (loading) return <p className="p-6 text-center">Loading users...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-bold">User Management</h1>
        <Button
          onClick={openCreateModal}
          label="Add User"
          className="w-full sm:w-32 h-10 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {users.map((user) => (
          <div key={user.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <div className="flex gap-4">
                <img
                  src={editIcon}
                  alt="Edit"
                  className="w-5 h-5 cursor-pointer"
                  onClick={() => openUpdateModal(user)}
                />
                <img
                  src={deleteIcon}
                  alt="Delete"
                  className="w-5 h-5 cursor-pointer"
                  onClick={() => handleDelete(user.id)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 text-sm pt-2 border-t border-gray-100">
              <div>
                <span className="text-gray-500 block">Role</span>
                <span className="font-medium">{user.role === 1 ? "Admin" : "Staff"}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Status</span>
                <span className={`font-medium ${user.isActive ? "text-green-600" : "text-gray-400"}`}>
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-200 text-left text-gray-700 uppercase text-xs">
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Active</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4 text-gray-600">{user.email}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${user.role === 1 ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                    {user.role === 1 ? "Admin" : "Staff"}
                  </span>
                </td>
                <td className="py-3 px-4">{user.isActive ? "✅" : "❌"}</td>
                <td className="py-3 px-4">
                  <div className="flex justify-center gap-3">
                    <img
                      src={editIcon}
                      alt="Update"
                      className="cursor-pointer w-5 h-5 opacity-70 hover:opacity-100"
                      onClick={() => openUpdateModal(user)}
                    />
                    <img
                      src={deleteIcon}
                      alt="Delete"
                      className="cursor-pointer w-5 h-5 opacity-70 hover:opacity-100"
                      onClick={() => handleDelete(user.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isCreateModalOpen && <CreateUserModal closeModal={closeCreateModal} />}
      {editingUser && (
        <UpdateUserModal closeModal={closeUpdateModal} user={editingUser} />
      )}
    </div>
  );
};

export default UserManagement;