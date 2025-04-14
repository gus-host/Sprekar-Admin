import NotificationIcon from "@/app/_svgs/NotificationIcon";
import { ChevronDown } from "lucide-react";
import DashboardMain from "./_partials/DashboardMain";
import { ReactNode } from "react";
import Sidebar from "./_partials/Sidebar";
import ProfileImgGetter from "./_partials/ProfileImgGetter";
import Link from "next/link";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-dvh">
      <div className="flex justify-between items-center px-[30px] py-[15px] border-b-[#A6A6A654] border-solid border-b-[1px] max-[1200px]:pl-[50px] z-[997]">
        <Link
          href={"/dashboard"}
          className="font-bold text-[20px] text-[#000000]"
        >
          SPREKAR
        </Link>
        <div className="flex items-center gap-[38px]">
          <NotificationIcon />
          <div className="flex items-center gap-[10px]">
            <ProfileImgGetter />
            <ChevronDown />
          </div>
        </div>
      </div>
      <DashboardMain>{children}</DashboardMain>
      <Sidebar />
    </div>
  );
}
