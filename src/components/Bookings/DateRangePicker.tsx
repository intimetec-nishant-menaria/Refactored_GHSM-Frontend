import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import Box from "@mui/material/Box";

interface Props {
    checkIn : Dayjs | null;
    checkOut : Dayjs | null; 
    handleDateClick: (date: Dayjs | null) => void;
}

const DateRangePicker = ({ checkIn, checkOut ,handleDateClick }: Props) => {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="flex flex-col md:flex-row gap-4 w-full">
        <DatePicker
          label="Check In"
          value={checkIn}
          onChange={(newDate)=>handleDateClick(newDate)}
          disablePast
          sx={{ width: { xs: "100%", md: 250 } }}
        />
        <DatePicker
          label="Check Out"
          value={checkOut}
          onChange={(newDate)=>handleDateClick(newDate)}
          disablePast
          minDate={checkIn ?? undefined}
          sx={{ width: { xs: "100%", md: 250 } }}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default DateRangePicker;