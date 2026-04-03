import { useRoomSummaryQuery } from '@/app/Api\'s/room';

const RoomStatusDashboard = () => {
  const {data , isLoading , isError ,error} = useRoomSummaryQuery();


  if (isLoading) return <div className="p-6 text-gray-400">Loading Dashboard...</div>;
  if (isError) return <div className="p-6 text-red-500">{error as string}</div>;

  const renderCard = (label: string, value: number, borderClass: string, textColor: string) => (
    <div className={`bg-white p-5 rounded-2xl border-l-4 ${borderClass} shadow-sm hover:shadow-md transition-all`}>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={`text-3xl font-black ${textColor}`}>{value}</p>
    </div>
  );

  return (
    <div className="p-4 pt-0">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Live Room Status</h2>
        <p className="text-sm text-slate-500">Current inventory overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {renderCard('Available', data?.available ?? 0, 'border-emerald-500', 'text-emerald-600')}
        {renderCard('Occupied', data?.occupied ?? 0, 'border-blue-500', 'text-blue-600')}
        {renderCard('Maintenance', data?.maintenance ?? 0, 'border-amber-500', 'text-amber-600')}
        {renderCard('Out of Order', data?.outOfOrder ?? 0, 'border-rose-500', 'text-rose-600')}
      </div>
    </div>
  );
};

export default RoomStatusDashboard;