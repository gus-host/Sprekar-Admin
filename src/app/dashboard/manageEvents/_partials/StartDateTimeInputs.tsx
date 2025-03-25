"use client";

import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Dayjs } from "dayjs";
import useResponsiveSizes from "@/utils/helper/general/useResponsiveSizes";

interface StartDateTimeSelectorProps {
  dateError?: boolean | string;
  timeError?: boolean | string;
  dateError2?: boolean | string;
  timeError2?: boolean | string;
  dateValue?: Dayjs | null;
  timeValue?: Dayjs | null;
  onChangeDate?: (newValue: Dayjs | null) => void;
  onChangeTime?: (newValue: Dayjs | null) => void;
  isEdit?: boolean;
}

export default function StartDateTimeSelector({
  dateError,
  timeError,
  dateError2,
  timeError2,
  dateValue,
  timeValue,
  onChangeDate,
  onChangeTime,
  isEdit,
}: StartDateTimeSelectorProps) {
  const { clientWidth } = useResponsiveSizes();
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        className="flex gap-4"
        style={{
          alignItems:
            clientWidth && clientWidth > 760 && !isEdit
              ? dateError || timeError || dateError2 || timeError2
                ? "flex-start"
                : "flex-end"
              : "flex-start",
        }}
      >
        {/* Date Picker */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-700 text-sm font-medium mb-1">
            Start <span className="text-red-500">*</span>
          </label>
          <DatePicker
            label="Select Date"
            name="startDate"
            value={dateValue}
            onChange={onChangeDate}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!dateError,
                helperText: dateError,
                sx: {
                  "& .MuiInputBase-root": { backgroundColor: "#E1E1E1" }, // Apply bg color only to input
                },
              },
            }}
          />
        </div>

        {/* Time Picker */}
        <div className="flex flex-col gap-2">
          <label className="text-gray-700 text-sm font-medium mb-1">
            Time <span className="text-red-500">*</span>
          </label>
          <TimePicker
            label="Select Time"
            name="startTime"
            value={timeValue}
            onChange={onChangeTime}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!timeError,
                helperText: timeError,
                sx: {
                  "& .MuiInputBase-root": { backgroundColor: "#E1E1E1" }, // Apply bg color only to input
                },
              },
            }}
          />
        </div>
      </div>
    </LocalizationProvider>
  );
}
