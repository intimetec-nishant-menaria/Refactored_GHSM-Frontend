import { useRoomSummaryQuery } from "@/app/Api/room";

const RoomStatusDashboard = () => {
  const { data, isLoading, isError, error } = useRoomSummaryQuery();

  if (isLoading) return (
    <div className="p-6 text-text-muted font-bold animate-pulse">
      Loading Dashboard...
    </div>
  );

  if (isError) return (
    <div className="p-6 text-danger font-black">
      {typeof error === 'string' ? error : "Failed to load summary"}
    </div>
  );

  const renderCard = (label: string, value: number, borderClass: string, textColor: string, bgColor: string) => (
    <div className={`bg-surface p-6 rounded-[2rem] border-l-[6px] ${borderClass} ${bgColor} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}>
      <p className="text-[10px] font-black text-text-muted/60 uppercase tracking-[0.2em] mb-2 group-hover:text-text-main transition-colors">
        {label}
      </p>
      <p className={`text-4xl font-black tracking-tighter ${textColor}`}>
        {value}
      </p>
    </div>
  );

  return (
    <div className="p-4 pt-0 bg-layout">
      <div className="mb-8">
        <h2 className="text-xl font-black text-text-main tracking-tight uppercase">Live Room Status</h2>
        <p className="text-sm font-medium text-text-muted">Real-time inventory overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderCard(
            'Available', 
            data?.available ?? 0, 
            'border-success', 
            'text-success', 
            'hover:bg-success/5'
        )}
        {renderCard(
            'Occupied', 
            data?.occupied ?? 0, 
            'border-primary', 
            'text-primary', 
            'hover:bg-primary/5'
        )}
        {renderCard(
            'Maintenance', 
            data?.maintenance ?? 0, 
            'border-amber-500', 
            'text-amber-600', 
            'hover:bg-amber/5'
        )}
        {renderCard(
            'Out of Order', 
            data?.outOfOrder ?? 0, 
            'border-danger', 
            'text-danger', 
            'hover:bg-danger/5'
        )}
      </div>
    </div>
  );
};

export default RoomStatusDashboard;