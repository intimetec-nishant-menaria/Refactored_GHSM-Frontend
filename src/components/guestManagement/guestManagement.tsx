import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "@/app/asyncThunk/userThunk";
import type { RootState } from "@/app/store/store";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import Button from "@/components/common/button/Button";
import deleteIcon from "@/assets/deleteIcon.png";
import editIcon from "@/assets/editIcon.png";
import UpdateUserModal from "@/components/userManagement/updateUserModel";
import type { User } from "@/utils/interfaces/user";
import { fetchAllGuest } from "@/app/asyncThunk/guestThunk";
import type { GuestState } from "@/utils/interfaces/guest";
import CreateGuestModal from "./guestAddModel";

const GuestManagement = () => {
  const dispatch = useAppDispatch();
  const { Guests, loading, error } = useSelector(
    (state: RootState) => state.guest,
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    dispatch(fetchAllGuest());
  }, [dispatch]);

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);
  const openUpdateModal = (guest : GuestState) => setEditingUser(guest);
  const closeUpdateModal = () => setEditingUser(null);

  const handleDelete = async (guestId: number) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await dispatch(deleteUser(guestId));
      await dispatch(fetchUsers());
    }
  };

  if (loading) return <p className="p-6 text-center">Loading users...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl md:text-2xl font-bold">Guest Management</h1>
        <Button
          onClick={openCreateModal}
          label="Add Guest"
          className="w-full sm:w-32 h-10 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {Guests.map((guest) => (
          <div
            key={guest.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-gray-900">{guest.name}</p>
                <p className="text-sm text-gray-500">{guest.email}</p>
              </div>
              <div className="flex gap-4">
                <img
                  src={editIcon}
                  alt="Edit"
                  className="w-5 h-5 cursor-pointer"
                  onClick={() => openUpdateModal(guest)}
                />
                <img
                  src={deleteIcon}
                  alt="Delete"
                  className="w-5 h-5 cursor-pointer"
                  onClick={() => handleDelete(guest.id)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 text-sm pt-2 border-t border-gray-100">
              <div>
                <span className="text-gray-500 block">contact</span>
                <span className="font-medium">
                  {guest.contact}
                </span>
              </div>
              <div>
               <span className="text-gray-500 block">Address</span>
                <span className="font-medium">
                  {guest.Address}
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
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Address</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Guests.map((guest) => (
              <tr key={guest.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">{guest.name}</td>
                <td className="py-3 px-4 text-gray-600">{guest.email}</td>
                <td className="py-3 px-4 text-gray-600">{guest.contact}</td>
                <td className="py-3 px-4">{guest.Address}</td>
                <td className="py-3 px-4">
                  <div className="flex justify-center gap-3">
                    <img
                      src={editIcon}
                      alt="Update"
                      className="cursor-pointer w-5 h-5 opacity-70 hover:opacity-100"
                      onClick={() => openUpdateModal(guest)}
                    />
                    <img
                      src={deleteIcon}
                      alt="Delete"
                      className="cursor-pointer w-5 h-5 opacity-70 hover:opacity-100"
                      onClick={() => handleDelete(guest.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isCreateModalOpen && <CreateGuestModal closeModal={closeCreateModal} />}
      {editingUser && (
        <UpdateUserModal closeModel={closeUpdateModal} data={editingUser} />
      )}
    </div>
  );
};

export default GuestManagement;
