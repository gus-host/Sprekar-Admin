"use client";

import React, { useState } from "react";
import { useFormik, FormikProvider } from "formik";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import moment from "moment-timezone";
import { useEffect } from "react";
import axios from "axios";

import EventNameInput from "./EventNameInput";
import CalenderBlue from "@/app/_svgs/CalenderBlue";
import StartDateTimeSelector from "./StartDateTimeInputs";
import EndDateTimeSelector from "./EndDateTimeInputs";
import Toggle from "@/components/Toggle";
import SupportedLanguagesSelect, {
  languageMap,
} from "./SupportedLanguagesSelect";
import TimeZoneSelect from "./TimeZoneSelect";
import { eventFormValidation } from "./eventFormValidation";
import EventDescriptionInput from "./EventDescriptionInput";
import ModalMUI from "@/components/ModalMUI";
import Spinner from "@/components/ui/Spinner";

import SuccessIcon from "@/app/_svgs/SuccessIcon";
import FailedIcon from "@/app/_svgs/FailedIcon";
import ToggleRecurring from "./ToggleRecurring";

interface Event {
  status: string;
  name: string;
  id?: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  supportedLanguages: string[];
  timezone: string;
  description: string;
  qrCode: string;
  eventCode: string;
  isQRCodeEnabled: boolean;
  isRecurring?: boolean;
}

export default function EditEventForm({
  eventData,
  error,
}: {
  eventData: Event;
  error?: string;
}) {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isFailedModalOpen, setIsFailedModalOpen] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  const router = useRouter();

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
      isReoccuring: true,
    },
    onSubmit: async (values) => {
      const name = values.name;
      const description = !values.description
        ? "No Description"
        : values.description;
      const startDate = values.startDate
        ? (values.startDate as dayjs.Dayjs).format("YYYY-MM-DD")
        : undefined;

      const startTime = values.startTime
        ? (values.startTime as dayjs.Dayjs).toISOString()
        : undefined;
      const endDate = values.endDate
        ? (values.endDate as dayjs.Dayjs).format("YYYY-MM-DD")
        : undefined;

      const endTime = values.endTime
        ? (values.endTime as dayjs.Dayjs).toISOString()
        : undefined;
      const supportedLanguages = values.supportedLanguages.map(
        (lang) => (lang as { value: string }).value
      );
      const timezone = values.timezone.value;
      const isQRCodeEnabled = values.isQRCodeEnabled;
      const isReoccuring = values.isReoccuring;
      const id = eventData.id;

      try {
        setIsCreatingEvent(true);
        const response = await axios.post(
          "/api/event/update-event",
          {
            name,
            description,
            startDate,
            startTime,
            endDate,
            endTime,
            supportedLanguages,
            timezone,
            isQRCodeEnabled,
            isReoccuring,
            id,
          },
          { withCredentials: true }
        );
        if (response.status === 201 || response.status === 200) {
          // console.log(response.data);

          setIsSuccessModalOpen((open) => !open);
        } else {
          setIsFailedModalOpen((open) => !open);
        }
      } catch (error) {
        console.log(error);
        setIsFailedModalOpen((open) => !open);
      } finally {
        setIsCreatingEvent(false);
      }
    },
  });

  useEffect(() => {
    const selectedLanguages = eventData.supportedLanguages; // Example selected languages
    const formattedLanguages = selectedLanguages.map((code) => ({
      value: code,
      label: languageMap[code] || code, // Fallback to code if label isn't found
    }));

    eventFormIk.setFieldValue("supportedLanguages", formattedLanguages);
    eventFormIk.setFieldValue("name", eventData.name);
    eventFormIk.setFieldValue("description", eventData.description);
    eventFormIk.setFieldValue("isQRCodeEnabled", eventData.isQRCodeEnabled);
    eventFormIk.setFieldValue("isReoccuring", eventData.isRecurring);

    // Set other fields
    eventFormIk.setFieldValue("startDate", dayjs(eventData.startDate));
    eventFormIk.setFieldValue("startTime", dayjs(eventData.startTime));
    eventFormIk.setFieldValue("endDate", dayjs(eventData.endDate));
    eventFormIk.setFieldValue("endTime", dayjs(eventData.endTime));
    eventFormIk.setFieldValue("timezone", {
      value: eventData.timezone,
      label: eventData.timezone,
    });
  }, []);

  useEffect(() => {
    if (eventData.name) {
      document.title = `${eventData.name} | Edit Event | Sprekar`;
    }
  }, [eventData?.name]);

  function getGmtOffset(timezone: string): string {
    const offsetMinutes = moment.tz(timezone).utcOffset();
    const sign = offsetMinutes >= 0 ? "+" : "-";
    const hours = Math.floor(Math.abs(offsetMinutes) / 60);
    const minutes = Math.abs(offsetMinutes) % 60;
    const gmtOffset = `GMT${sign}${hours}${minutes > 0 ? ":" + minutes : ""}`;
    return gmtOffset;
  }
  // function handleRetry() {
  //   window.location.reload();
  // }
  if (error)
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800 text-center">
        <p>Error: {error}</p>
        <button
          onClick={router.refresh}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
        >
          Retry
        </button>
      </div>
    );

  return (
    <FormikProvider value={eventFormIk}>
      <form onSubmit={eventFormIk.handleSubmit} className="mb-[200px]">
        <div className="max-w-[900px] my-6">
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
        <div className="mb-6">
          <h3 className="mb-4">
            Date & time ({getGmtOffset(eventFormIk.values.timezone.value)})
          </h3>
          <div
            className="flex gap-4 flex-col"
            style={{
              alignItems: "flex-start",
            }}
          >
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
              isEdit={true}
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
              isEdit={true}
            />
          </div>
        </div>
        <div className="mb-9 flex flex-wrap gap-4">
          <div className="flex gap-2 text-[14px] ">
            <strong>Enable QR Code </strong>
            <Toggle name="isQRCodeEnabled" />
          </div>
          <div className="flex gap-2 text-[14px] ">
            <strong>Is Recurring? </strong>
            <ToggleRecurring name="isReoccuring" />
          </div>
        </div>
        <div className="flex gap-3 items-start max-w-[800px] mb-[50px] flex-wrap">
          <SupportedLanguagesSelect
            name="supportedLanguages"
            label={`Supported Languages (${eventFormIk.values.supportedLanguages.length})`}
          />
          <TimeZoneSelect fieldName="timezone" />
          <EventDescriptionInput
            value={eventFormIk.values.description}
            onChange={eventFormIk.handleChange}
            onBlur={eventFormIk.handleBlur}
            // onFocus={eve}
          />
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            className="focus-visible:outline-none px-10 py-2 bg-white border border-[#858585] text-[14px] rounded-sm hover:bg-gray-100"
            disabled={isCreatingEvent}
            style={{
              cursor: isCreatingEvent ? "not-allowed" : "pointer",
            }}
            onClick={() => router.push("/dashboard/manageEvents")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="focus:border-none focus-visible:outline-none px-2 py-2 text-[14px] text-white bg-[#025FF3] font-bold tracking-[-1px] rounded-sm hover:bg-[#024dc4] flex justify-center items-center gap-2"
            style={{
              fontFamily: "Helvetica Compressed, sans-serif",
              boxShadow: "0px 0px 6.4px 4px #0255DA57",
              opacity: isCreatingEvent ? "0.5" : "1",
              cursor: isCreatingEvent ? "not-allowed" : "pointer",
            }}
            disabled={isCreatingEvent}
          >
            {isCreatingEvent ? (
              <Spinner size={12} color="#fff" strokeWidth={2} />
            ) : (
              ""
            )}
            <span>{isCreatingEvent ? "Saving" : "Save"} Changes</span>
          </button>
        </div>
      </form>
      {isSuccessModalOpen && (
        <ModalMUI
          isModalOpen={isSuccessModalOpen}
          setIsModalOpen={setIsSuccessModalOpen}
        >
          <div className="flex flex-col px-[30px] py-[20px] items-center justify-center text-center">
            <SuccessIcon />
            <p className="mt-4 text-center">Changes saved successfully</p>
            <button
              type="button"
              className="focus:border-none focus-visible:outline-none px-3 py-2 text-[14px] text-white bg-[#025FF3] font-bold tracking-[-1px] rounded-sm hover:bg-[#024dc4] flex justify-center items-center gap-2 w-full mt-7"
              style={{
                fontFamily: "Helvetica Compressed, sans-serif",
                boxShadow: "0px 0px 6.4px 4px #0255DA57",
              }}
              onClick={() => router.push("/dashboard/manageEvents")}
            >
              <span>Done</span>
            </button>
          </div>
        </ModalMUI>
      )}
      {isFailedModalOpen && (
        <ModalMUI
          isModalOpen={isFailedModalOpen}
          setIsModalOpen={setIsFailedModalOpen}
        >
          <div className="flex flex-col px-[30px] py-[20px] items-center justify-center text-center">
            <FailedIcon />
            <p className="mt-4 text-center">No changes were saved</p>
            <button
              type="button"
              className="focus:border-none focus-visible:outline-none px-3 py-2 text-[14px] text-white bg-[#025FF3] font-bold tracking-[-1px] rounded-sm hover:bg-[#024dc4] flex justify-center items-center gap-2 w-full mt-7"
              style={{
                fontFamily: "Helvetica Compressed, sans-serif",
                boxShadow: "0px 0px 6.4px 4px #0255DA57",
              }}
              onClick={() => router.push("/dashboard/manageEvents")}
            >
              <span>Done</span>
            </button>
          </div>
        </ModalMUI>
      )}
    </FormikProvider>
  );
}
