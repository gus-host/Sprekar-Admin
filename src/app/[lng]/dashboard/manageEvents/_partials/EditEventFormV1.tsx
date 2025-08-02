"use client";

import React from "react";
import { useFormik, FormikProvider } from "formik";
import EventNameInput from "./EventNameInput";
import CalenderBlue from "@/app/[lng]/_svgs/CalenderBlue";
import StartDateTimeSelector from "./StartDateTimeInputs";
import EndDateTimeSelector from "./EndDateTimeInputs";
import Toggle from "@/components/Toggle";
import SupportedLanguagesSelect from "./SupportedLanguagesSelect";
import TimeZoneSelect from "./TimeZoneSelect";
import { eventFormValidation } from "./eventFormValidation";
import moment from "moment-timezone";
import EventDescriptionInput from "./EventDescriptionInput";

export default function CreateEventForm() {
  const eventFormIk = useFormik({
    validationSchema: eventFormValidation,
    initialValues: {
      name: "",
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
      supportedLanguages: [],
      timezone: { value: "", label: "" },
      description: "",
      isQRCodeEnabled: true,
    },
    onSubmit: async (values) => {
      console.log("Submitted values:", values);
    },
  });

  function getGmtOffset(timezone: string): string {
    const offsetMinutes = moment.tz(timezone).utcOffset();
    const sign = offsetMinutes >= 0 ? "+" : "-";
    const hours = Math.floor(Math.abs(offsetMinutes) / 60);
    const minutes = Math.abs(offsetMinutes) % 60;
    const gmtOffset = `GMT${sign}${hours}${minutes > 0 ? ":" + minutes : ""}`;
    return gmtOffset;
  }

  // console.log(
  //   eventFormIk.values.startDate,
  //   eventFormIk.values.startTime,
  //   eventFormIk.values.supportedLanguages
  // );

  return (
    <FormikProvider value={eventFormIk}>
      <form onSubmit={eventFormIk.handleSubmit}>
        <div className="max-w-[900px]my-6">
          <EventNameInput
            error={eventFormIk.submitCount > 0 && eventFormIk.errors.name}
            value={eventFormIk.values.name}
            onChange={eventFormIk.handleChange}
            onBlur={eventFormIk.handleBlur}
          />
        </div>

        <div className="flex gap-3 text-[14px] mb-6">
          <CalenderBlue />{" "}
          <p className="text-[#0827F6]">When is the event happening?</p>
        </div>
        <div>
          <h3>
            Date & time ({getGmtOffset(eventFormIk.values.timezone.value)})
          </h3>
          <div className="items-start">
            <StartDateTimeSelector
              dateError={
                eventFormIk.submitCount > 0 && eventFormIk.errors.startDate
              }
              timeError={
                eventFormIk.submitCount > 0 && eventFormIk.errors.startTime
              }
              dateValue={eventFormIk.values.startDate}
              timeValue={eventFormIk.values.startTime}
              onChangeDate={(newValue) =>
                eventFormIk.setFieldValue("startDate", newValue)
              }
              onChangeTime={(newValue) =>
                eventFormIk.setFieldValue("startTime", newValue)
              }
            />
            <EndDateTimeSelector
              dateError={
                eventFormIk.submitCount > 0 && eventFormIk.errors.endDate
              }
              timeError={
                eventFormIk.submitCount > 0 && eventFormIk.errors.endTime
              }
              dateValue={eventFormIk.values.endDate}
              timeValue={eventFormIk.values.endTime}
              onChangeDate={(newValue) =>
                eventFormIk.setFieldValue("endDate", newValue)
              }
              onChangeTime={(newValue) =>
                eventFormIk.setFieldValue("endTime", newValue)
              }
            />
          </div>
        </div>
        <div className="flex gap-2 text-[14px]">
          <strong>Enable QR Code </strong>
          <Toggle name="isQRCodeEnabled" />
        </div>
        <div className="flex gap-3 items-start">
          <SupportedLanguagesSelect name="supportedLanguages" />
          <TimeZoneSelect fieldName="timezone" />
          <EventDescriptionInput
            value={eventFormIk.values.description}
            onChange={eventFormIk.handleChange}
            onBlur={eventFormIk.handleBlur}
          />
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            className="focus:border-none focus-visible:outline-none px-5 py-2 bg-white border border-[#858585] text-[14px] rounded-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="focus:border-none focus-visible:outline-none px-2 py-2 text-[14px] text-white bg-[#025FF3] font-bold tracking-[-1px] rounded-sm hover:bg-[#024dc4]"
            style={{
              fontFamily: "Helvetica Compressed, sans-serif",
              boxShadow: "0px 0px 6.4px 4px #0255DA57",
            }}
          >
            Generate Event Code
          </button>
        </div>
      </form>
    </FormikProvider>
  );
}
