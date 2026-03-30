export default function AppLoader() {
  return (
    <div className="flex items-center gap-3 p-2 animate-pulse">
    <div className="w-10 h-10 bg-slate-200 rounded-full shadow-sm"></div>
    
    <div className="flex flex-col gap-2">
      <div className="h-3 w-24 bg-slate-200 rounded-md"></div>
      <div className="h-2 w-32 bg-slate-100 rounded-md"></div>
    </div>
  </div>
  );
}