"use client";

import { useFormik } from "formik";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";

import TextInput from "@/app/_partials/TextInputs";
import Button from "@/components/Button";
import AuthButton from "../_partials/AuthButton";
import { signupValidationSchema } from "./signupValidationSchema";

import {
  setRefreshTokenCookie,
  setUserTokenCookie,
} from "@/utils/helper/auth/cookieUtility";
import { handleAxiosError } from "@/utils/helper/general/errorHandler";

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const router = useRouter();
  const signupFormIk = useFormik({
    validationSchema: signupValidationSchema,
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
    onSubmit: async (values) => {
      try {
        setIsCreatingUser(true);
        const response = await axios.post("/api/auth/create-user", {
          ...values,
        });
        if (response.status === 201 || response.status === 200) {
          toast.success("Registered successfully");
          router.push(
            `/verify-email?email=${encodeURIComponent(values.email)}`
          );
        } else {
          toast.error(response.data.data.message || "An error occured");
        }
      } catch (error) {
        if (axios.isAxiosError(error))
          toast.error(error?.response?.data?.message || "An error occured.");
        if (error instanceof Error) console.log(error);
      } finally {
        setIsCreatingUser(false);
      }
    },
  });

  const handleGoogleAuth = async (token: string) => {
    try {
      setLoading(true);
      const payload = { token: token, role: "ADMIN" };

      const response = await axios.post(
        "/api/auth/googleSignUp",
        {
          ...payload,
        },
        { withCredentials: true }
      );

      if (response.status === 201 || response.status === 200) {
        const { access, refresh } = response.data.data.tokens;
        setUserTokenCookie(access);
        setRefreshTokenCookie(refresh);
        toast.success(response.data.message || "Login Successful");
        router.push("/dashboard");
      } else {
        toast.error(
          response.data.data.message || "Something went wrong! Try again"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      handleAxiosError(error);
      toast.error("Unable to login!");
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const googleSignUp = useGoogleLogin({
    onSuccess: (tokenResponse) => handleGoogleAuth(tokenResponse.access_token),
    onError: () => alert("Google signup failed"),
  });

  return (
    <form onSubmit={signupFormIk.handleSubmit}>
      <div className="mb-[20px]">
        <h2 className="text-[20px] font-bold">Let’s Get Started</h2>
        <p className="text-[12px] font-medium text-[#9B9B9B]">
          Already have an account?{" "}
          <Link className="text-[#0255DA] hover:underline" href={"/login"}>
            Login
          </Link>
        </p>
      </div>
      <div className="flex flex-col gap-[25px] mb-[40px]">
        <TextInput
          type="text"
          name="firstName"
          placeholder="first Name"
          value={signupFormIk.values.firstName}
          onChange={signupFormIk.handleChange}
          error={signupFormIk.submitCount > 0 && signupFormIk.errors.firstName}
          onBlur={signupFormIk.handleBlur}
        />
        <TextInput
          type="text"
          name="lastName"
          placeholder="last Name"
          value={signupFormIk.values.lastName}
          onChange={signupFormIk.handleChange}
          error={signupFormIk.submitCount > 0 && signupFormIk.errors.lastName}
          onBlur={signupFormIk.handleBlur}
        />
        <TextInput
          type="email"
          name="email"
          placeholder="Email Address"
          value={signupFormIk.values.email}
          onChange={signupFormIk.handleChange}
          error={signupFormIk.submitCount > 0 && signupFormIk.errors.email}
          onBlur={signupFormIk.handleBlur}
        />
        <TextInput
          type="password"
          name="password"
          placeholder="Password"
          showPasswordToggle
          value={signupFormIk.values.password}
          onChange={signupFormIk.handleChange}
          error={signupFormIk.submitCount > 0 && signupFormIk.errors.password}
          onBlur={signupFormIk.handleBlur}
        />
      </div>

      <div
        className="flex flex-col gap-[16px]"
        style={{
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.5 : 1,
        }}
      >
        <Button
          text={"Next"}
          classNames="rounded-[50px]"
          type="submit"
          isLoading={isCreatingUser}
        />
      </div>

      <div className="min-h-[20px] text-center relative text-[#D9D9D9] font-medium text-[14px] my-[10px]">
        <div className="absolute border-b-[1px] border-[#D9D9D9] top-[50%] left-[0] min-w-[45%] translate-y-[-50%]"></div>
        OR
        <div className="absolute border-b-[1px] border-[#D9D9D9] top-[50%] right-[0] min-w-[45%] translate-y-[-50%]"></div>
      </div>

      <div className="flex flex-col gap-[15px]">
        <span
          onClick={() => {
            if (loading) return;
            googleSignUp();
          }}
          style={{
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.5 : 1,
          }}
        >
          <AuthButton type="google" action={"Continue "} isLoading={loading} />
        </span>
      </div>
      <div className="text-[#747474] text-[12px] flex items-center gap-1 mt-2 font-medium ">
        <input type="checkbox" />{" "}
        <span>
          {" "}
          I have read, understood and agreed to the{" "}
          <Link className="text-[#0255DA] hover:underline" href={"#"}>
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link className="text-[#0255DA] hover:underline" href={"#"}>
            Privacy Policy
          </Link>
        </span>
      </div>
    </form>
  );
}
