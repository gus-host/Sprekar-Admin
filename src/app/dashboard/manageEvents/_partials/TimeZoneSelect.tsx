"use client";

import React, { useEffect } from "react";
import { useField } from "formik";
import Timezone from "react-timezone-select";
import { ITimezone } from "react-timezone-select";

interface TimeZoneSelectProps {
  fieldName: string; // renamed prop instead of "name" to avoid conflicts
  label?: string;
}

export default function TimeZoneSelect({
  fieldName,
  label = "Time zone",
}: TimeZoneSelectProps) {
  const [field, meta, helpers] = useField<ITimezone>(fieldName);

  // Optional: if you want to set a default value using the browser's timezone
  const defaultTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  useEffect(() => {
    if (
      !field.value ||
      (typeof field.value !== "string" && !field.value.value)
    ) {
      helpers.setValue({ value: defaultTimezone, label: defaultTimezone });
    }
  }, [defaultTimezone, field.value, helpers]);

  return (
    <div className="flex flex-col gap-2 timezoneBox w-full">
      <label className="text-gray-700 text-sm font-medium">
        {label} <span className="text-red-500">*</span>
      </label>
      <Timezone
        value={field.value}
        name={fieldName}
        onChange={(newValue: ITimezone) => helpers.setValue(newValue)}
        className="bg-[#f5f5f5]"
        instanceId="my-unique-select"
      />
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm">
          {typeof meta.error === "string"
            ? meta.error
            : JSON.stringify(meta.error)}
        </div>
      ) : null}
    </div>
  );
}
