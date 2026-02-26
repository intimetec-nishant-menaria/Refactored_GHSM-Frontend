import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { fetchRooms } from "@/app/asyncThunk/roomThunk";
import RoomManageCards from "@/components/roomManagement/roomManageCards";

const RoomManagement = () => {
  const dispatch = useAppDispatch();

  const { rooms, loading, error } = useAppSelector((state) => state.room);

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return <RoomManageCards rooms={rooms} />;
};

export default RoomManagement;
