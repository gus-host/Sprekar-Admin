"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useFormik, FormikProvider } from "formik";
import moment from "moment-timezone";

import EventNameInput from "./EventNameInput";
import StartDateTimeSelector from "./StartDateTimeInputs";
import EndDateTimeSelector from "./EndDateTimeInputs";
import Toggle from "@/components/Toggle";
import SupportedLanguagesSelect, {
  languageOptions,
} from "./SupportedLanguagesSelect";
import TimeZoneSelect from "./TimeZoneSelect";
import { eventFormValidation } from "./eventFormValidation";
import EventDescriptionInput from "./EventDescriptionInput";
import ModalMUI from "@/components/ModalMUI";
import Spinner from "@/components/ui/Spinner";
import useResponsiveSizes from "@/utils/helper/general/useResponsiveSizes";
import QrCode from "./QrCode";

import CalenderBlue from "@/app/_svgs/CalenderBlue";
import ToggleRecurring from "./ToggleRecurring";

export const downloadQrcodeImage = (base64QRCode?: string) => {
  // Create a temporary link element
  if (!base64QRCode) return toast.error("No qrcode found");
  const a = document.createElement("a");
  a.href = base64QRCode || "";
  a.download = "qrcode.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export default function CreateEventForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [event, setEvent] = useState<{
    eventCode?: string;
    description?: string;
    qrCode?: string;
  }>({});
  const router = useRouter();
  const { clientWidth } = useResponsiveSizes();
  const eventFormIk = useFormik({
    validationSchema: eventFormValidation,
    initialValues: {
      name: "",
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
      supportedLanguages: languageOptions,
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

      try {
        setIsCreatingEvent(true);
        const response = await axios.post(
          "/api/event/create-event",
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
          },
          { withCredentials: true }
        );
        if (response.status === 201 || response.status === 200) {
          setEvent(response?.data?.data?.data?.event);
          setIsModalOpen((open) => !open);
        } else {
          toast.error(response.data.data.message || "An error occured");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (
            error.response?.data.message ===
            "Event with the same name already exists for this user."
          )
            return toast.error("You have an event with this name already!");
          toast.error(error?.response?.data?.message || "An error occured.");
        }
        if (error instanceof Error) console.log(error);
      } finally {
        setIsCreatingEvent(false);
      }
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
            className="flex gap-4 max-[760px]:flex-col max-[760px]:items-start"
            style={{
              alignItems:
                clientWidth && clientWidth > 760
                  ? (eventFormIk.submitCount > 0 &&
                      eventFormIk.errors.startDate) ||
                    (eventFormIk.submitCount > 0 &&
                      eventFormIk.errors.startTime) ||
                    (eventFormIk.submitCount > 0 &&
                      eventFormIk.errors.endDate) ||
                    (eventFormIk.submitCount > 0 && eventFormIk.errors.endTime)
                    ? "flex-start"
                    : "flex-end"
                  : "flex-start",
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

        <div className="flex gap-3 items-start max-w-[800px] mb-[50px] max-[760px]:flex-wrap">
          <SupportedLanguagesSelect
            name="supportedLanguages"
            label={`Supported Languages (${eventFormIk.values.supportedLanguages.length})`}
          />
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
            <span>
              {isCreatingEvent ? "Generating" : "Generate"} Event Code
            </span>
          </button>
        </div>
      </form>
      {isModalOpen && (
        <ModalMUI isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
          <div className="flex flex-col items-center gap-6">
            <QrCode
              eventCode={event.eventCode}
              qrCode={event.qrCode}
              description={event.description}
            />
            <div className="flex gap-4">
              <button
                type="button"
                className="focus-visible:outline-none px-8 py-2 bg-white border border-[#858585] text-[12px] rounded-sm hover:bg-gray-100"
                onClick={() => {
                  router.push("/dashboard/manageEvents");
                  // setIsModalOpen(false);
                }}
              >
                {"Back to events"}
              </button>
              {event.qrCode && (
                <button
                  type="button"
                  className="focus:border-none focus-visible:outline-none px-2 py-2 text-[12px] text-white bg-[#025FF3] font-bold tracking-[-1px] rounded-sm hover:bg-[#024dc4]"
                  style={{
                    fontFamily: "Helvetica Compressed, sans-serif",
                    boxShadow: "0px 0px 6.4px 4px #0255DA57",
                  }}
                  onClick={() => downloadQrcodeImage(event?.qrCode)}
                >
                  Download QR code
                </button>
              )}
            </div>
          </div>
        </ModalMUI>
      )}
    </FormikProvider>
  );
}
