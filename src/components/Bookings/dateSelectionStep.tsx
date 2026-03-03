import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

interface Props{
    startDate : string | null;
    endDate : string | null ;
    handleDateClick : (info:any)=>void;
}

function DateSelectionStep({startDate , endDate, handleDateClick } : Props){
  

  return (
    <div className="h-fit flex flex-col">
        <div className="h-10 bg-white shadow flex items-center px-6">
            <h1 className="text-lg font-semibold">Booking Calendar</h1>
        </div>
        <div className="flex-1 p-2 bg-gray-50">
            <div className="bg-white max-w-2xl rounded-2xl shadow p-4">
            <FullCalendar
                    height={400}
                    contentHeight={50}
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    fixedWeekCount={false} 
                    selectable={true}
                    dateClick={handleDateClick}
                    events={
                        startDate && endDate
                        ? [
                            {
                                start: startDate,
                                end: endDate,
                                display: "background",
                            },
                            ]
                        : []
                    }
                />
            </div>
        </div>
    </div>
  );
}

export default DateSelectionStep;