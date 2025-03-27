import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

export default function QrCode({
  eventCode,
  qrCode,
  description,
  classes,
  error,
}: {
  eventCode?: string;
  qrCode?: string;
  description?: string;
  classes?: string;
  error?: string;
}) {
  if (error)
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800 text-center">
        <p>Error: {error}</p>
      </div>
    );
  return (
    <div
      className={cn(
        "flex flex-col items-center px-5 py-6 rounded-[15px]",
        classes
      )}
      style={{ boxShadow: "0px 2px 7.3px 2px #00000017" }}
    >
      <Image
        src={"/logo-sprekar.png"}
        width={55}
        height={45}
        alt={"Sprekar logo"}
        quality={100}
        className="mb-3"
        style={{ minHeight: "35px", minWidth: "45px" }} // Maintain aspect ratio
      />
      <div className="flex min-h-5 max-w-[250px] mb-2">
        <Image
          src={"/google-badge.png"}
          width={94}
          height={10}
          style={{ minHeight: "10px", minWidth: "94px" }} // Maintain aspect ratio
          alt="Get on google"
          quality={100}
        />

        <Image
          src={"/apple-badge.png"}
          alt="Get on apple"
          width={94}
          height={10}
          quality={100}
          style={{ minHeight: "10px", minWidth: "94px" }} // Maintain aspect ratio
        />
      </div>
      <p className="text-[12px] text-[#939292] font-medium mb-2">
        Get sprekar on your phone
      </p>
      <h3 className="font-bold text-[14px]">{eventCode || ""}</h3>
      <div className="relative min-w-[150px] min-h-[140px] mb-2">
        {!qrCode && (
          <div className="min-w-[150px] min-h-[140px] flex items-center justify-center">
            <p className="text-[14px] text-gray-500">No QR code</p>
          </div>
        )}
        {qrCode && (
          <Image
            src={qrCode}
            alt="qr code"
            fill
            style={{ minHeight: "140px", minWidth: "140px" }} // Maintain aspect ratio
            className="aspect-square object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div>
      {description && (
        <p className="text-center leading-[1.5] text-[#303030] text-[12px] max-w-[250px]">
          {description}
        </p>
      )}
    </div>
  );
}
