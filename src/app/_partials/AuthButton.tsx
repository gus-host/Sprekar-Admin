"use client";
import GoogleIcon from "@/public/svgs/GoogleIcon";
import AppleIcon from "@/public/svgs/AppleIcon";

export default function AuthButton({
  type,
  action,
  isLoading,
}: {
  type: "google" | "apple";
  action?: string;
  isLoading?: boolean;
}) {
  return (
    <div
      className="bg-white w-full hover:bg-gray-100 py-[10px] flex justify-center border-[#D9D9D9] border-solid border-[1px]"
      style={{
        cursor: isLoading ? "not-allowed" : "pointer",
        opacity: isLoading ? 0.5 : 1,
      }}
    >
      <div className="flex items-center gap-[10px] text-[12px]">
        {type === "google" && (
          <>
            <GoogleIcon />
            <span>
              {isLoading ? "connecting..." : `${action} with Google`}{" "}
            </span>
          </>
        )}
        {type === "apple" && (
          <>
            <AppleIcon />
            <span>{isLoading ? "connecting..." : `${action} with Apple`} </span>
          </>
        )}
      </div>
    </div>
  );
}
