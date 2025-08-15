"use client";

import React from "react";
import { useField } from "formik";
import Select, { ActionMeta, SingleValue, StylesConfig } from "react-select";

interface TimeZoneSelectProps {
  fieldName: string; // renamed prop instead of "name" to avoid conflicts
  label?: string;
}

export interface EventType {
  value?: string;
  label?: string;
}

export type EventTypeKey =
  | "FAITH_RELIGION"
  | "TALKS_PANELS"
  | "BUSINESS_CORPORATE"
  | "EDUCATION_LEARNING"
  | "COMMUNITY_SOCIAL"
  | "GOVERNMENT_LEGAL"
  | "HEALTH_WELLNESS"
  | "TRAVEL_HOSPITALITY"
  | "PERFORMANCE_ARTS";

export const EVENT_TYPE_OPTIONS: { value: EventTypeKey; label: string }[] = [
  { value: "FAITH_RELIGION", label: "Faith & Religion" },
  { value: "TALKS_PANELS", label: "Talks & Panels" },
  { value: "BUSINESS_CORPORATE", label: "Business & Corporate" },
  { value: "EDUCATION_LEARNING", label: "Education & Learning" },
  { value: "COMMUNITY_SOCIAL", label: "Community & Social" },
  { value: "GOVERNMENT_LEGAL", label: "Government & Legal" },
  { value: "HEALTH_WELLNESS", label: "Health & Wellness" },
  { value: "TRAVEL_HOSPITALITY", label: "Travel & Hospitality" },
  { value: "PERFORMANCE_ARTS", label: "Performance Arts" },
];

const customStylesEventType: StylesConfig<EventType, false> = {
  control: (base) => ({
    ...base,
    backgroundColor: "#f5f5f5",
    borderColor: "#ccc",
    boxShadow: "none",
    ":hover": {
      borderColor: "#999",
    },
    minHeight: 18,
  }),
  placeholder: (base) => ({
    ...base,
    color: "#999",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    color: "#666",
    ":hover": {
      color: "#333",
    },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
  }),
};

export default function EventTypeSelect({
  fieldName,
  label = "Event Type",
}: TimeZoneSelectProps) {
  const [field, meta, helpers] = useField<EventType>(fieldName);

  const handleChange = function (
    newValue: SingleValue<EventType>,
    actionMeta: ActionMeta<EventType>
  ) {
    console.log(actionMeta);

    helpers.setValue({ ...newValue }); // Update Formik state
  };

  return (
    <div className="flex flex-col gap-2 timezoneBox w-full">
      <label className="text-gray-700 text-sm font-medium">
        {label} <span className="text-red-500">*</span>
      </label>
      <Select
        instanceId="event-type"
        closeMenuOnSelect={true}
        options={EVENT_TYPE_OPTIONS}
        value={field.value}
        onChange={handleChange}
        onBlur={() => helpers.setTouched(true)}
        name={fieldName}
        placeholder="Event type"
        styles={customStylesEventType}
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
