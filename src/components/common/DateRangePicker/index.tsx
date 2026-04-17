import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import Box from "@mui/material/Box";

interface Props {
  checkIn: Dayjs | null;
  checkOut: Dayjs | null;
  handleCheckInClick: (date: Dayjs | null) => void;
  handleCheckOutClick: (date: Dayjs | null) => void;
  allowPast?: boolean;
}

const DateRangePicker = ({ checkIn, checkOut, handleCheckInClick, handleCheckOutClick, allowPast = false }: Props) => {
  
  const fieldStyles = {
    width: { xs: "100%", md: 250 },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "var(--color-surface)",
      color: "var(--color-text-main)", 
      "& fieldset": {
        borderColor: "var(--color-border)",
      },
      "&:hover fieldset": {
        borderColor: "var(--color-primary-hover)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "var(--color-primary)",
      },
      "& .MuiInputBase-input": {
        color: "var(--color-text-main)",
        WebkitTextFillColor: "var(--color-text-main)", 
      },
    },
    "& .MuiInputLabel-root": {
      color: "var(--color-text-muted)",
      "&.Mui-focused": {
        color: "var(--color-primary)",
      },
    },
    "& .MuiSvgIcon-root": {
      color: "var(--color-primary)",
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box className="flex flex-col md:flex-row gap-4 w-full">
        <DatePicker
          label="Check In"
          value={checkIn}
          onChange={(newDate) => handleCheckInClick(newDate)}
          disablePast={!allowPast}
          sx={fieldStyles}
        />
        <DatePicker
          label="Check Out"
          value={checkOut}
          onChange={(newDate) => handleCheckOutClick(newDate)}
          disablePast={!allowPast}
          minDate={checkIn ?? undefined}
          sx={fieldStyles}
        />
      </Box>
    </LocalizationProvider>
  );
};

export default DateRangePicker;