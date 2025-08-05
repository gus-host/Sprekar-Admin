"use client";

import { useFormik } from "formik";
import { getValidationSchema } from "./contact-us.validation";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useTranslation } from "@/app/i18n/client";

function useContactusFormik(lng: string) {
  const { t } = useTranslation(lng, "contact");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const validationSchema = getValidationSchema(t);
  const formik = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    },
    onSubmit: async (values) => {
      console.log(values);
      try {
        setIsSubmitting(true);
        const response = await axios.post("/api/contact-us", {
          ...values,
        });
        console.log(response);
        if (response.status === 201 || response.status === 200) {
          console.log(response.data);
          toast.success(`${t("contact.toast.success")}`);
        } else {
          console.log(response.data);
          toast.error(
            response.data.data.message || `${t("contact.toast.error")}`
          );
        }
      } catch (error) {
        if (axios.isAxiosError(error))
          toast.error(
            error?.response?.data?.message || `${t("contact.toast.error")}`
          );
        if (error instanceof Error) console.log(error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });
  return { formik, isSubmitting, setIsSubmitting };
}

export default useContactusFormik;
