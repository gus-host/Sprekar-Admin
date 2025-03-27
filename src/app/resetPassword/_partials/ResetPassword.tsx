"use client";

import { useFormik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

import { validationSchema } from "../validation";
import TextInput from "@/app/_partials/TextInputs";
import Button from "@/components/Button";
import api from "@/utils/axios/api";

export const revalidate = 0;
export default function ResetPassword() {
  const searchParams = useSearchParams();
  const queryParams = new URLSearchParams(searchParams);
  const id = queryParams.get("id") || "";
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formIk = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      password: "",
      passwordConfirm: "",
    },
    onSubmit: async (values) => {
      console.log(values);
      try {
        setIsSubmitting(true);
        const response = await api.post(
          `/auth/change-password`,
          {
            ...values,
            id,
          },
          { withCredentials: true }
        );
        if (response.status === 201 || response.status === 200) {
          toast.success(response.data.message || "Password successfully reset");
          router.push(`/login`);
        } else {
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
        <h2 className="text-[20px] font-bold">Reset Password</h2>
        <p className="text-[12px] mt-1 font-medium text-[#9B9B9B]">
          Please enter your new password and Otp you received at your email
        </p>
      </div>
      <div className="flex flex-col gap-[25px] mb-8">
        <TextInput
          type="password"
          name="password"
          placeholder="Old Password"
          showPasswordToggle
          value={formIk.values.password}
          onChange={formIk.handleChange}
          error={formIk.submitCount > 0 && formIk.errors.password}
          onBlur={formIk.handleBlur}
        />
        <TextInput
          type="password"
          name="passwordConfirm"
          placeholder="New Password"
          showPasswordToggle
          value={formIk.values.passwordConfirm}
          onChange={formIk.handleChange}
          error={formIk.submitCount > 0 && formIk.errors.passwordConfirm}
          onBlur={formIk.handleBlur}
        />
      </div>

      <div className="flex flex-col gap-[16px]">
        <Button
          text={"Reset Password"}
          classNames="rounded-[5px]"
          type={"submit"}
          isLoading={isSubmitting}
        />
      </div>
    </form>
  );
}
