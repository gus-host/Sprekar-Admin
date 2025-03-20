"use client";
import React, { useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/utils/axios/api";
import OtpInput from "react-otp-input";
import formatSeconds from "@/utils/helper/general/formatSeconds";
import axios from "axios";
// import { useRouter } from "next/navigation";

const MAX_LENGTH = 6;
export default function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParams = new URLSearchParams(searchParams);
  const email = queryParams.get("email") || "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [error, setError] = useState("");
  const [time, setTime] = useState(120);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error, setError]);

  useEffect(() => {
    setTime(120);
    const id = setInterval(() => {
      setTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      clearInterval(id);
      setTime(120);
    };
  }, []);

  useEffect(
    function () {
      async function handleVerifyOtp(email: string, otp: string) {
        try {
          setIsSubmitting(true);
          const numOtp = +otp;
          console.log(typeof numOtp);
          const response = await api.post("/api/auth/verify-email", {
            email,
            otp: numOtp,
          });
          console.log(response);
          if (response.status === 201 || response.status === 200) {
            console.log(response.data);
            toast.success(
              response.data.message || "Email Verified Successfully"
            );
            router.push(`/login`);
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
      }
      if (otp.length === MAX_LENGTH) {
        handleVerifyOtp(email, otp);
      }
    },
    [otp, email, router]
  );

  const handleResendOtp = async (email: string) => {
    try {
      setIsSendingOtp(true);
      const response = await api.post("/api/auth/resend-otp", { email });
      console.log(response);
      if (response.status === 201 || response.status === 200) {
        console.log(response.data);
        toast.success(response.data.message);
      } else {
        console.log(response.data);
        toast.error(response.data.data.message || "An error occured");
      }
    } catch (error) {
      if (axios.isAxiosError(error))
        toast.error(error?.response?.data?.message || "An error occured.");
      if (error instanceof Error) console.log(error);
    } finally {
      setIsSendingOtp(false);
    }
  };

  return (
    <form>
      <div className="mb-[20px]">
        <h2 className="text-[20px] font-bold">Verify Email</h2>
        <p className="text-[12px] font-medium text-[#9B9B9B]">
          A 6 digit verification code has been sent to your email, check and
          input to verify your account.
        </p>
      </div>
      <div
        className="flex flex-col gap-[25px]"
        style={{
          cursor: isSubmitting ? "not-allowed" : "",
          opacity: isSubmitting ? "0.5" : "1",
        }}
      >
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={MAX_LENGTH}
          renderInput={(props) => (
            <input
              {...props}
              className="p-[20px] bg-transparent border-solid border-[#000000] border-[1px] rounded-[3px] width-4 h-[4rem] focus-visible:outline-none focus-visible:border-[#0255DA] max-[600px]:width-small-2 max-[600px]:h-[2.4rem] max-[600px]:p-[5px] max-[600px]:text-[12px]"
              style={{ cursor: isSubmitting ? "not-allowed" : "" }}
            />
          )}
          containerStyle={{
            gap: "10px",
            cursor: isSubmitting ? "not-allowed" : "",
          }}
        />
      </div>
      <div className={"flex items-center justify-end text-[14px] mb-8 mt-2"}>
        {time > 0 ? (
          <p className="">
            <span className="">{formatSeconds(time)}</span>
          </p>
        ) : (
          <p className="">
            Didn&apos;t get any code?{" "}
            <span
              className="cursor-pointer text-[#0255DA] font-semibold hover:font-bold hover:underline"
              onClick={() => handleResendOtp(email as string)}
            >
              {isSendingOtp ? "Resending..." : "Resend"}
            </span>
          </p>
        )}
      </div>
    </form>
  );
}
