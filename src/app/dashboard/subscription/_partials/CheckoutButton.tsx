"use client";

import { cn } from "@/lib/utils";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CheckoutButton({ priceId }: { priceId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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
          router.push(response.data.data.data?.url);
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
        "px-2 py-1 bg-[#025FF3] text-white rounded text-[14px] cursor-pointer",
        loading ? "opacity-50" : "opacity-100"
      )}
    >
      {loading ? "Redirecting..." : "Subscribe"}
    </button>
  );
}
