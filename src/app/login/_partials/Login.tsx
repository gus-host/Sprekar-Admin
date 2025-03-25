"use client";
import React, { useState } from "react";
import Button from "@/components/Button";
import TextInput from "@/app/_partials/TextInputs";
import Link from "next/link";
import { useFormik } from "formik";
import { loginValidationSchema } from "../loginValidation";
import { useRouter } from "next/navigation";
import api from "@/utils/axios/api";
import toast from "react-hot-toast";
import axios from "axios";
import {
  getRefreshTokenCookie,
  removeUserTokenCookie,
  setRefreshTokenCookie,
  setUserTokenCookie,
} from "@/utils/helper/auth/cookieUtility";

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const refreshToken = getRefreshTokenCookie();
  const loginFormIk = useFormik({
    validationSchema: loginValidationSchema,
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        const response = await api.post("/api/auth/login", {
          ...values,
        });
        if (response.status === 201 || response.status === 200) {
          const accessToken = response?.data?.data?.tokens?.access?.token || "";
          const refreshToken = response?.data?.data?.tokens?.refresh;

          if (accessToken) {
            setUserTokenCookie(accessToken);
            setRefreshTokenCookie(refreshToken);
          }
          toast.success(response.data.message || "Login Successful");
          router.push(`/dashboard`);
        } else {
          console.log(response.data);
          toast.error(response.data.message || "An error occured");
          removeUserTokenCookie();
        }
      } catch (error) {
        removeUserTokenCookie();
        if (axios.isAxiosError(error))
          toast.error(error?.response?.data?.message || "An error occured.");
        if (error instanceof Error) console.log(error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={loginFormIk.handleSubmit}>
      <div className="mb-[20px]">
        <h2 className="text-[20px] font-bold">Welcome Back</h2>
        <p className="text-[12px] font-medium text-[#9B9B9B]">
          Don’t have an account?{" "}
          <Link className="text-[#0255DA] hover:underline" href={"/"}>
            Sign Up
          </Link>
        </p>
      </div>
      <div className="flex flex-col gap-[25px] ">
        <TextInput
          type="email"
          name="email"
          placeholder="Email Address"
          value={loginFormIk.values.email}
          onChange={loginFormIk.handleChange}
          error={loginFormIk.submitCount > 0 && loginFormIk.errors.email}
          onBlur={loginFormIk.handleBlur}
        />
        <TextInput
          type="password"
          name="password"
          placeholder="Password"
          showPasswordToggle
          value={loginFormIk.values.password}
          onChange={loginFormIk.handleChange}
          error={loginFormIk.submitCount > 0 && loginFormIk.errors.password}
          onBlur={loginFormIk.handleBlur}
        />
      </div>

      <div className="flex justify-between items-center mt-3 mb-[40px] text-[#000000] text-[12px]">
        <div className="flex items-center gap-1">
          <input type="checkbox" /> <span>Remember me</span>
        </div>
        {refreshToken && (
          <Link
            href={"/forgotPassword"}
            className="hover:underline hover:font-medium"
          >
            Forgot password?
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-[16px]">
        <Button
          text={"Log in"}
          classNames="rounded-[5px]"
          type="submit"
          isLoading={isSubmitting}
        />
      </div>
    </form>
  );
}
