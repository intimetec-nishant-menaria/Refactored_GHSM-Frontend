const DashboardCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-start">
        <h2 className="text-3xl font-bold">85%</h2>
        <p className="text-gray-500 text-sm mt-1">Occupancy Rate</p>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-start">
        <h2 className="text-3xl font-bold">$2,350</h2>
        <p className="text-gray-500 text-sm mt-1">Today's Revenue</p>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-start">
        <h2 className="text-3xl font-bold">120</h2>
        <p className="text-gray-500 text-sm mt-1">Total Bookings</p>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-start">
        <h2 className="text-3xl font-bold">15</h2>
        <p className="text-gray-500 text-sm mt-1">Available Rooms</p>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-start">
        <h2 className="text-3xl font-bold">22</h2>
        <p className="text-gray-500 text-sm mt-1">Today's Check-ins</p>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-start">
        <h2 className="text-3xl font-bold">18</h2>
        <p className="text-gray-500 text-sm mt-1">Today's Check-outs</p>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-start">
        <h2 className="text-3xl font-bold">34</h2>
        <p className="text-gray-500 text-sm mt-1">New Guests</p>
      </div>

      <div className="bg-white shadow-md rounded-xl p-6 flex flex-col items-start">
        <h2 className="text-3xl font-bold">5</h2>
        <p className="text-gray-500 text-sm mt-1">Cancellations</p>
      </div>
    </div>
  );
};

export default DashboardCards;
