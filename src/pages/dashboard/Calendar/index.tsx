import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { DatesSetArg, EventInput } from "@fullcalendar/core";
import calendarIcon from "@/assets/calendarIcon.png";
import crossIcon from "@/assets/crossIcon.png";
import type { BookingPayload } from "@/utils/interfaces/booking";
import { useLazyFetchBookingByRangeQuery } from "@/app/Api/booking";

function Calendar() {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [triggerFetchBookingByRange] = useLazyFetchBookingByRangeQuery();

  const handleDatesSet = async (dateInfo: DatesSetArg) => {
    const startDate = new Date(dateInfo.startStr).toISOString();
    const endDate = new Date(dateInfo.endStr).toISOString();

    const res: BookingPayload[] = (await triggerFetchBookingByRange({ startDate, endDate }).unwrap()) ?? [];

    const formatedData = res.map((booking) => ({
      id: booking.id.toString(),
      title: `${booking.guestName} (Room ${booking.roomNumber})`,
      start: booking.checkInDate,
      end: booking.checkOutDate,
      backgroundColor: getStatusColor(booking.status),
      borderColor: getStatusColor(booking.status),
      extendedProps: {
        status: booking.status,
        userId: booking.guestId,
      },
    }));
    setEvents(formatedData);
  };

  function getStatusColor(status: number) {
    switch (status) {
      case 1: return "#6366f1"; 
      case 2: return "#f59e0b"; 
      case 3: return "#10b981";
      case 4: return "#ef4444"; 
      default: return "#94a3b8"; 
    }
  }

  return (
    <div className="flex flex-col min-h-fit pt-4 pb-4 font-sans bg-layout transition-colors duration-300">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-black text-text-main tracking-tight uppercase">
            Booking Insights
          </h1>
          <p className="text-text-muted text-sm mt-1 font-medium">
            Manage and monitor room availability at a glance.
          </p>
        </div>

        {!isCalendarOpen && (
          <button
            onClick={() => setIsCalendarOpen(true)}
            className="flex items-center gap-3 bg-surface hover:bg-primary/5 text-primary px-6 py-3 rounded-2xl border border-primary/20 shadow-xl shadow-primary/10 transition-all active:scale-95"
          >
            <img src={calendarIcon} alt="" className="w-5 h-5" />
            <span className="font-black text-xs uppercase tracking-widest">Open Schedule</span>
          </button>
        )}
      </div>

      {isCalendarOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-main/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-6xl h-[90vh] flex flex-col bg-surface rounded-[2rem] shadow-2xl border border-border overflow-hidden animate-in zoom-in duration-300">
            <div className="flex items-center justify-between p-6 border-b border-muted bg-layout/30">
              <div>
                <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
                  Guest House Management
                </span>
                <h2 className="text-xl font-black text-text-main">
                  Live Booking Schedule
                </h2>
              </div>
              <button
                onClick={() => setIsCalendarOpen(false)}
                className="p-2 hover:bg-danger/10 rounded-full transition-all group"
              >
                <img
                  src={crossIcon}
                  className="w-6 h-6 opacity-40 group-hover:opacity-100 group-hover:invert-[.2] transition-opacity"
                  alt="close"
                />
              </button>
            </div>

            <div className="flex-1 p-4 md:p-8 custom-fullcalendar overflow-y-auto bg-surface transition-colors duration-300
              [&_.fc-theme-standard_.fc-scrollgrid]:border-border
              [&_.fc-theme-standard_td]:border-border
              [&_.fc-theme-standard_th]:border-border
              [&_.fc-col-header-cell-cushion]:text-text-main
              [&_.fc-daygrid-day-number]:text-text-muted
              [&_.fc-day-today]:!bg-primary/5
              [&_.fc-toolbar-title]:text-text-main
              [&_.fc-toolbar-title]:font-black
              [&_.fc-button-primary]:bg-primary
              [&_.fc-button-primary]:border-none
              [&_.fc-button-primary]:rounded-xl
              [&_.fc-event]:cursor-pointer
              [&_.fc-event]:shadow-sm
            ">
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
                viewClassNames="font-bold"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;