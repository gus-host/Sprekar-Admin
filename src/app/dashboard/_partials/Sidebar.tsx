import DashboardIcon from "@/app/_svgs/DashboardIcon";
import CalenderIcon from "@/app/_svgs/CalenderIcon";
import MicIcon from "@/app/_svgs/MicIcon";
import PastIcon from "@/app/_svgs/PastIcon";
import PeopleIcon from "@/app/_svgs/PeopleIcon";
import SubscriptionIcon from "@/app/_svgs/SubscriptionIcon";
import SettingsIcon from "@/app/_svgs/SettingsIcon";
import ExitIcon from "@/app/_svgs/ExitIcon";
import NavLink from "./NavLink";

export const dynamic = "force-static";
export const revalidate = 0;

export default function Sidebar() {
  return (
    <div
      className={`fixed bg-[#1E1E1E] left-[15px] top-[80.67px] px-[15px] pt-[30px] pb-[50px] text-[#fff] text-[16px] max-[1200px]:top-0 max-[1200px]:left-0 max-[1200px]:collapse max-[1200px]:rounded-[0px] rounded-[10px] h-[85dvh]`}
    >
      <div className="flex flex-col justify-between gap-[35px] h-full relative">
        <div className="flex flex-col gap-[20px] overflow-y-auto h-[288px] scrollbar-thin scrollbar-thumb-white scrollbar-track-[transparent]">
          <NavLink
            href={"/dashboard"}
            className="flex items-center gap-[10px] hover:opacity-[100]"
          >
            <DashboardIcon /> <span>Dashboard</span>
          </NavLink>
          <NavLink
            href={"/dashboard/manageEvents"}
            className="flex items-center gap-[10px] hover:opacity-[100]"
          >
            <CalenderIcon /> <span>Manage Events</span>
          </NavLink>
          <NavLink
            href={"/dashboard/liveTranslation"}
            className="flex items-center gap-[10px] hover:opacity-[100]"
          >
            <MicIcon /> <span>Live Translation</span>
          </NavLink>
          <NavLink
            href={"/dashboard/pastTranslations"}
            className="flex items-center gap-[10px] hover:opacity-[100]"
          >
            <PastIcon /> <span>Past Translations</span>
          </NavLink>
          <NavLink
            href={"/dashboard/attendeeManagement"}
            className="flex items-center gap-[10px] hover:opacity-[100]"
          >
            <PeopleIcon /> <span>Attendee Management </span>
          </NavLink>
          <NavLink
            href={"/dashboard/subscription"}
            className="flex items-center gap-[10px] hover:opacity-[100]"
          >
            <SubscriptionIcon /> <span>Subscription & Billing</span>
          </NavLink>
          <NavLink
            href={"/dashboard/settings"}
            className="flex items-center gap-[10px] hover:opacity-[100]"
          >
            <SettingsIcon /> <span>Settings</span>
          </NavLink>
        </div>
        <NavLink href="/login" className="flex items-center gap-[10px]">
          <span className="opacity-[100]">
            <ExitIcon />{" "}
          </span>
          <span className="opacity-50 hover:opacity-[100]">Log out</span>
        </NavLink>
      </div>
    </div>
  );
}
