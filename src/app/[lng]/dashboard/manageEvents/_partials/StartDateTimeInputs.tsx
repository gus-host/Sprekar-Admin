"use client";

import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  DatePicker,
  TimePicker,
  MobileDatePicker,
  MobileTimePicker,
} from "@mui/x-date-pickers";
import { Dayjs } from "dayjs";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

interface StartDateTimeSelectorProps {
  dateError?: boolean | string;
  timeError?: boolean | string;
  dateValue?: Dayjs | null;
  timeValue?: Dayjs | null;
  onChangeDate?: (newValue: Dayjs | null) => void;
  onChangeTime?: (newValue: Dayjs | null) => void;
  isEdit?: boolean;
}

export default function StartDateTimeSelector({
  dateError,
  timeError,
  dateValue,
  timeValue,
  onChangeDate,
  onChangeTime,
  isEdit,
}: StartDateTimeSelectorProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // pick which component to render
  const DateComp = isMobile ? MobileDatePicker : DatePicker;
  const TimeComp = isMobile ? MobileTimePicker : TimePicker;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="flex flex-wrap gap-4">
        {/* Date Picker */}
        <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
          <label className="text-gray-700 text-sm font-medium mb-1">
            Start <span className="text-red-500">*</span>
          </label>
          <DateComp
            label="Select Date"
            value={dateValue}
            onChange={onChangeDate}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!dateError,
                helperText: dateError,
                sx: {
                  "& .MuiInputBase-root": { backgroundColor: "#E1E1E1" },
                },
              },
            }}
          />
        </div>

        {/* Time Picker */}
        <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
          <label className="text-gray-700 text-sm font-medium mb-1">
            Time <span className="text-red-500">*</span>
          </label>
          <TimeComp
            label="Select Time"
            value={timeValue}
            onChange={onChangeTime}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!timeError,
                helperText: timeError,
                sx: {
                  "& .MuiInputBase-root": { backgroundColor: "#E1E1E1" },
                },
              },
            }}
          />
        </div>
      </div>
    </LocalizationProvider>
  );
}
