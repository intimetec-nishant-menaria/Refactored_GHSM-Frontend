const Loader = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50/50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
        
        <p className="text-sm font-medium text-gray-600 animate-pulse">
          Refreshing data...
        </p>
      </div>
    </div>
  );
};

export default Loader;