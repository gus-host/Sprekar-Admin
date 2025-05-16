"use client";

import { cn } from "@/lib/utils";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CheckoutButton({
  priceId,
  text,
}: {
  priceId: string;
  text?: string;
}) {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/subscription/subscribe",
        {
          priceId,
        },
        { withCredentials: true }
      );
      if (response.status === 201 || response.status === 200) {
        console.log();
        // setIsSuccessModalOpen((open) => !open);
        console.log(response.data.data.data);
        if (response.data.data.data?.url) {
          window.open(response.data.data.data?.url, "_blank");
          // router.replace();
        }
      } else {
        toast.error(response.data.data.message || "An error occured");
      }
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message || "An error occured.");
      }
      if (error instanceof Error) console.log(error);
      // setIsFailedModalOpen((open) => !open);
    } finally {
      // setIsCreatingEvent(false);
      setLoading(false);
    }
  };

  return (
    <button
      disabled={loading}
      onClick={handleClick}
      className={cn(
        text
          ? "focus:border-none focus-visible:outline-none px-3 py-2 text-[14px] text-white bg-[#025FF3] font-bold tracking-[-1px] rounded-sm flex justify-center items-center gap-2 w-full mt-7 cursor-pointer"
          : "px-2 py-1 bg-[#025FF3] text-white rounded text-[14px] cursor-pointer",
        loading ? "opacity-50" : "opacity-100"
      )}
      style={{
        fontFamily: text ? "Helvetica Compressed, sans-serif" : "",
        boxShadow: text ? "0px 0px 6.4px 4px #0255DA57" : "",
      }}
    >
      {loading ? "Redirecting..." : text || "Subscribe"}
    </button>
  );
}
