"use client";

import Image from "next/image";
import { Skeleton } from "@mui/material";
import { Suspense } from "react";

interface User {
  profilePicture?: string;
  firstName?: string;
  lastName?: string;
}

const svg = `
<svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" fill="#025FF321"/>
  <circle cx="50" cy="40" r="12" fill="#0827F6"/>
  <path d="M30 75 C30 65, 70 65, 70 75 C70 82, 30 82, 30 75 Z" fill="#0827F6"/>
</svg>
`;
export const encodedSvg = encodeURIComponent(svg);

export default function ProfileImg({ user }: { user: User }) {
  return (
    <Suspense fallback={<Skeleton variant="circular" width={28} height={28} />}>
      <>
        {user?.profilePicture ? (
          <Image
            src={user.profilePicture}
            width={28}
            height={28}
            className="rounded-full"
            alt={"profile picture"}
          />
        ) : user.firstName && user.lastName ? (
          <div className="h-[28px] w-[28px] rounded-full bg-[#025FF321] text-[12px] text-[#0827F6] text-center flex justify-center items-center">
            <span>
              {user.firstName.at(0)}
              {user.lastName.at(0)}
            </span>
          </div>
        ) : (
          <Image
            src={`data:image/svg+xml,${encodedSvg}`}
            alt="Profile Icon"
            width={28}
            height={28}
            className="rounded-full"
          />
        )}
      </>
    </Suspense>
  );
}
