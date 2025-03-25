import NotificationIcon from "@/app/_svgs/NotificationIcon";
import { ChevronDown } from "lucide-react";
import DashboardMain from "./_partials/DashboardMain";
import { ReactNode } from "react";
import Sidebar from "./_partials/Sidebar";
import ProfileImg from "./_partials/ProfileImg";
export const metadata = {
  title: "Dashboard",
};

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-dvh">
      <div className="flex justify-between items-center px-[30px] py-[15px] border-b-[#A6A6A654] border-solid border-b-[1px] max-[1200px]:pl-[50px] z-[997]">
        <h2 className="font-bold text-[20px] text-[#000000]">SPREKAR</h2>
        <div className="flex items-center gap-[38px]">
          <NotificationIcon />
          <div className="flex items-center gap-[10px]">
            <ProfileImg />
            <ChevronDown />
          </div>
        </div>
      </div>
      <DashboardMain>{children}</DashboardMain>
      <Sidebar />
    </div>
  );
}
