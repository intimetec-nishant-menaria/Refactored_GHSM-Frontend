import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import useNavigate
import deleteIcon from "@/assets/deleteIcon.png";
import editIcon from "@/assets/editIcon.png";
import type { User } from "@/utils/interfaces/user";
import ConfirmationModel from "../common/confirmationModel/confirmationModel";
import { useAppSelector } from "@/hooks/useAppSelector";
import toast from "react-hot-toast";
import PagingController from "../common/paging/PagingController";
import Modal from "../common/modal";
import CreateUserForm from "./createUserForm";
import UpdateUserForm from "./updateUserForm";
import { useDeleteUserMutation, useFetchAllUsersQuery } from "@/app/Api's/user";

const UserManagement = () => {
  const navigate = useNavigate(); // 2. Initialize navigate
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isConfirmationModelOpen, setConfirmationModel] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [searchUser, setSearchUser] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [debounceSearch, setDebounceSearch] = useState("");

  const { data: users, isLoading } = useFetchAllUsersQuery({
    currentPage,
    pageSize,
    searchUser: debounceSearch,
  });
  const [deleteUser] = useDeleteUserMutation();

  useEffect(() => {
    let id = setTimeout(() => {
      setDebounceSearch(searchUser);
    }, 500);
    return () => clearTimeout(id);
  }, [searchUser]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debounceSearch]);

  const handleViewHistory = (user: User) => {
    navigate(`/auditLog?entityName=User&entityId=${user.id}`);
  };

  const handleDelete = async (targetUserId: number) => {
    if (targetUserId === currentUser?.id) {
      toast.error("You cannot delete your own administrative account.");
      return;
    }
    try {
      await deleteUser(targetUserId).unwrap();
      toast.success("User removed successfully.");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete user.");
    }
    setUserId(null);
    setConfirmationModel(false);
  };

  if (isLoading)
    return (
      <div className="py-32 text-center">
        <div className="animate-bounce text-blue-600 font-black text-2xl">...</div>
      </div>
    );

  return (
    <div className="p-4 md:p-8 min-h-screen w-full font-sans">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500 text-sm">Manage team access levels and system permissions</p>
        </div>

        <button
          onClick={() => setIsCreateFormOpen(true)}
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-2xl text-xs font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
        >
          + Add System User
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-8">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchUser}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchUser(e.target.value)}
            className="w-full border border-slate-200 p-3 pl-10 rounded-xl focus:ring-4 focus:ring-blue-50 outline-none text-sm transition-all bg-slate-50/30"
          />
          <span className="absolute left-4 top-3.5 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
      </div>
      
      <div className="hidden md:block bg-white rounded-3xl border border-slate-100 shadow-sm mb-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left table-auto">
            <thead className="bg-slate-50 text-slate-500 border-b text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="py-5 px-8 whitespace-nowrap">User Profile</th>
                <th className="py-5 px-8 whitespace-nowrap">Access Role</th>
                <th className="py-5 px-8 whitespace-nowrap">System Status</th>
                <th className="py-5 px-8 text-right whitespace-nowrap min-w-[150px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users?.data.map((u) => (
                <tr key={u.id} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="py-5 px-8 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{u.name}</span>
                      <span className="text-[11px] text-slate-400 font-medium italic">{u.email}</span>
                    </div>
                  </td>
                  <td className="py-5 px-8 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${u.role === "Admin" ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-blue-50 text-blue-600 border-blue-100"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-5 px-8 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${u.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                      <span className={`text-xs font-bold ${u.isActive ? "text-emerald-600" : "text-slate-400"}`}>
                        {u.isActive ? "Active Account" : "Suspended"}
                      </span>
                    </div>
                  </td>
                  <td className="py-5 px-8 text-right whitespace-nowrap">
                    <div className="flex justify-end items-center gap-3 flex-nowrap shrink-0">
                      {/* History Button (Desktop) */}
                      <button 
                        onClick={() => handleViewHistory(u)}
                        title="View Activity Logs"
                        className="p-2 hover:bg-blue-50 rounded-lg transition-all text-blue-400 hover:text-blue-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>

                      <button 
                        onClick={() => setEditingUser(u)} 
                        className="p-2 hover:bg-white rounded-lg transition-all hover:shadow-sm shrink-0"
                      >
                        <img src={editIcon} alt="Edit" className="w-5 h-5 opacity-70 hover:opacity-100 transition-opacity" />
                      </button>
                      <button
                        onClick={() => {
                          setUserId(u.id);
                          setConfirmationModel(true);
                        }}
                        className="p-2 hover:bg-red-50 rounded-lg transition-all group/del shrink-0"
                      >
                        <img src={deleteIcon} alt="Delete" className="w-5 h-5 opacity-40 group-hover/del:opacity-100 transition-opacity grayscale group-hover/del:grayscale-0" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden mb-6">
        {users?.data.map((u) => (
          <div key={u.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-2xl font-black text-sm uppercase">
                  {u.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-tight">{u.name}</h3>
                  <p className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">{u.email}</p>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-tighter ${u.role === "Admin" ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-blue-50 text-blue-600 border-blue-100"}`}>
                {u.role}
              </span>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
              <div className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${u.isActive ? "bg-emerald-500" : "bg-slate-300"}`} />
                <span className={`text-[10px] font-bold ${u.isActive ? "text-emerald-600" : "text-slate-400"}`}>
                  {u.isActive ? "Active" : "Suspended"}
                </span>
              </div>
              <div className="flex gap-2">
                {/* History Button (Mobile) */}
                <button 
                  onClick={() => handleViewHistory(u)} 
                  className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>

                <button onClick={() => setEditingUser(u)} className="p-2.5 bg-slate-50 rounded-xl shrink-0">
                  <img src={editIcon} alt="Edit" className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setUserId(u.id);
                    setConfirmationModel(true);
                  }}
                  className="p-2.5 bg-red-50 rounded-xl shrink-0"
                >
                  <img src={deleteIcon} alt="Delete" className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-10">
        <PagingController
          dataLength={users?.metaData.totalCount ?? 0}
          currentPage={currentPage}
          itemPerPage={pageSize}
          goToPrevious={() => setCurrentPage((p) => Math.max(1, p - 1))}
          goToNext={() => setCurrentPage((p) => p + 1)}
          goToSpecificPage={setCurrentPage}
        />
      </div>

      <Modal title="Add New User" subTitle="Assign roles and access for your team." isOpen={isCreateFormOpen} closeModal={() => setIsCreateFormOpen(false)}>
        <CreateUserForm closeModel={() => setIsCreateFormOpen(false)} />
      </Modal>

      <Modal title="Update User" subTitle={`Modify account for ${editingUser?.name}.`} isOpen={!!editingUser} closeModal={() => setEditingUser(null)}>
        {editingUser && <UpdateUserForm closeModel={() => setEditingUser(null)} data={editingUser} />}
      </Modal>

      {isConfirmationModelOpen && (
        <ConfirmationModel
          label="Permanently delete this user account? This cannot be undone."
          isConfirmationModelOpen={setConfirmationModel}
          submitAction={() => handleDelete(userId!)}
          actionText="Delete User"
          classname="bg-red-500! hover:bg-red-600! shadow-red-100!"
        />
      )}
    </div>
  );
};

export default UserManagement;