"use client";
import { useTranslation } from "@/app/i18n/client";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function JoinEventForm({
  token,
  lng,
}: {
  token: string;
  lng: string;
}) {
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);
  const { t } = useTranslation(lng, "joinEvent");

  const formValidationSchema = Yup.object().shape({
    eventCode: Yup.string().required(
      `${t("joinEventForm.validation.required")}`
    ),
  });

  async function joinEvent(values: { eventCode: string }) {
    try {
      setIsJoining(true);
      const response = await fetch(`${BASE_URL}/events/${values.eventCode}`, {
        method: "GET",
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const data = await response.json();
      const id = data?.data?.event?.id;

      if (!id)
        return toast.error(
          data.message || `${t("joinEventForm.toast.failure")}`
        );
      toast.success(`${t("joinEventForm.toast.success")}`);
      router.push(`/join-event/${id}`); // Adjust if needed
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.log("Axios Error:", err.message);
        toast.error(`${t("joinEventForm.toast.error")}`);
      } else if (err instanceof Error) {
        toast.error(err.message);
        console.log("Fetch Error:", err);
      } else {
        toast.error(`${t("joinEventForm.toast.error")}`);
        console.log("Unknown Error:", err);
      }
    } finally {
      setIsJoining(false);
    }
  }

  // Ensure token is defined
  return (
    <Formik
      initialValues={{
        eventCode: "",
      }}
      validationSchema={formValidationSchema}
      onSubmit={async (values) => {
        // same shape as initial values
        await joinEvent(values);
      }}
    >
      {({ errors, touched }) => (
        <>
          <Form className="flex px-[20px] pl-[10px] bg-white rounded-[10px] relative max-w-[500px] mx-auto mt-[30px]">
            <Field
              type="text"
              name="eventCode"
              className="h-[60px] w-full border-none focus-within:border-none outline-none focus-visible:border-none focus-visible:border-b-0 active:border-none placeholder-[#7E7E7E78] placeholder:text-[14px] pl-[20px] max-[675px]:placeholder:text-[12px]"
              placeholder={t("joinEventForm.placeholder")}
            />
            <button
              type="submit"
              className="absolute right-[-35px] bg-[#0255DA] top-[50%] -translate-1/2 py-[12px] flex justify-center items-center rounded text-white text-[12px] font-semibold px-[20px] cursor-pointer outline-none focus-visible:border-none"
              style={{
                cursor: isJoining ? "not-allowed" : "pointer",
                opacity: isJoining ? "0.5" : "1",
              }}
              disabled={isJoining}
            >
              <span className="">
                {isJoining
                  ? `${t("joinEventForm.button.loading")}`
                  : `${t("joinEventForm.button.default")}`}
              </span>
            </button>
          </Form>
          <>
            {errors.eventCode && touched.eventCode ? (
              <div className="max-w-[500px] mx-auto">
                <div className="text-[12px] text-red-500 mt-1 font-semibold">
                  {errors.eventCode}
                </div>
              </div>
            ) : null}
          </>
        </>
      )}
    </Formik>
  );
}
