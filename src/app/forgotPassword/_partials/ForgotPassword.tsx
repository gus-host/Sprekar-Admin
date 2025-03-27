"use client";

import { useFormik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

import { validationSchema } from "../validation";
import TextInput from "@/app/_partials/TextInputs";
import Button from "@/components/Button";
import api from "@/utils/axios/api";

export default function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const formIk = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      email: "",
    },
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        const response = await api.post("/auth/forgot-password", {
          ...values,
        });
        console.log(response);
        if (response.status === 201 || response.status === 200) {
          console.log(response.data);
          toast.success("Success, Otp sent to your email");
          router.push(
            `/verify-email/password-reset?email=${encodeURIComponent(
              values.email
            )}`
          );
        } else {
          console.log(response.data);
          toast.error(response.data.data.message || "An error occured");
        }
      } catch (error) {
        if (axios.isAxiosError(error))
          toast.error(error?.response?.data?.message || "An error occured.");
        if (error instanceof Error) console.log(error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });
  return (
    <form onSubmit={formIk.handleSubmit}>
      <div className="mb-[20px]">
        <h2 className="text-[20px] font-bold">Forgot Password</h2>
        <p className="text-[12px] font-medium text-[#9B9B9B] mt-1 leading-[1.3]">
          Please enter the email associated with your account, kindly click on
          the link to reset your password.
        </p>
      </div>
      <div className="flex flex-col gap-[25px] mb-10 ">
        <TextInput
          type="email"
          name="email"
          placeholder="Email Address"
          value={formIk.values.email}
          onChange={formIk.handleChange}
          error={formIk.submitCount > 0 && formIk.errors.email}
          onBlur={formIk.handleBlur}
        />
      </div>

      <div className="flex flex-col gap-[16px]">
        <Button
          text={"Submit"}
          classNames="rounded-[5px]"
          type="submit"
          isLoading={isSubmitting}
        />
      </div>
    </form>
  );
}
