import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DatesSetArg } from "@fullcalendar/core";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { fetchBookingsByRange } from "@/app/asyncThunk/bookingThunk";
import calendarIcon from "@/assets/calendarIcon.png";
import crossIcon from "@/assets/crossIcon.png";

interface BookingDto {
  bookingId: number;
  userId: number;
  userName: string;
  roomNumber: string;
  start: string;
  end: string;
  bookingStatus: number;
}

function Calendar() {
  const [events, setEvents] = useState<unknown[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleDatesSet = async (dateInfo: DatesSetArg) => {
    const startDate = new Date(dateInfo.startStr).toISOString();
    const endDate = new Date(dateInfo.endStr).toISOString();

    const res: BookingDto[] = (await dispatch(fetchBookingsByRange({ startDate, endDate })).unwrap()) ?? [];

    const formatedData = res.map((booking) => ({
      id: booking.bookingId.toString(),
      title: `${booking.userName} (Room ${booking.roomNumber})`,
      start: booking.start,
      end: booking.end,
      backgroundColor: getStatusColor(booking.bookingStatus),
      borderColor: getStatusColor(booking.bookingStatus),
      extendedProps: {
        status: booking.bookingStatus,
        userId: booking.userId,
      },
    }));
    setEvents(formatedData ?? []);
  };

  function getStatusColor(status: number) {
    switch (status) {
      case 1: {
        return "#3b82f6";
      }
      case 2: {
        return "#eab308";
      }
      case 3: {
        return "#22c55e";
      }
      case 4: {
        return "#ef4444";
      }
      default: {
        return "#94a3b8";
      }
    }
  }

  return (
    <div className="flex flex-col h-screen p-4 md:p-8  font-sans">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Booking Insights
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage and monitor room availability at a glance.
          </p>
        </div>

        {!isCalendarOpen && (
          <button
            onClick={() => setIsCalendarOpen(true)}
            className="flex items-center gap-2 bg-white hover:bg-blue-50 text-blue-600 px-4 py-2 rounded-xl border border-blue-100 shadow-sm transition-all active:scale-95"
          >
            <img src={calendarIcon} alt="" className="w-5 h-5" />
            <span className="font-semibold text-sm">Open Schedule</span>
          </button>
        )}
      </div>
      {isCalendarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-5xl h-[90vh] flex flex-col bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in duration-300">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Guest House Management
                </span>
                <h2 className="text-xl font-bold text-slate-800">
                  Booking Schedule
                </h2>
              </div>
              <button
                onClick={() => setIsCalendarOpen(false)}
                className="p-2 hover:bg-red-50 rounded-full transition-all group"
              >
                <img
                  src={crossIcon}
                  className="w-6 h-6 opacity-40 group-hover:opacity-100 "
                  alt="close"
                />
              </button>
            </div>
            <div className="flex-1 p-4 md:p-8 custom-fullcalendar overflow-y-auto">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                height="100%"
                events={events}
                datesSet={handleDatesSet}
                fixedWeekCount={false}
                displayEventTime={false}
                headerToolbar={{
                  left: "prev,next today",
                  center: "title",
                  right: "",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
