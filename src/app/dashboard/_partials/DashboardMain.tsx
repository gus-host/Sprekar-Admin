'use client';

import DashboardIcon from '@/public/svgs/DashboardIcon';
import NavLink from './NavLink';
import CalenderIcon from '@/public/svgs/CalenderIcon';
import MicIcon from '@/public/svgs/MicIcon';
import PastIcon from '@/public/svgs/PastIcon';
import PeopleIcon from '@/public/svgs/PeopleIcon';
import SubscriptionIcon from '@/public/svgs/SubscriptionIcon';
import SettingsIcon from '@/public/svgs/SettingsIcon';
import ChevronLeftRounded from '@/public/svgs/ChevronLeftRounded';
import ExitIcon from '@/public/svgs/ExitIcon';
import { ReactNode, useEffect, useState } from 'react';
import { useWindowSize } from 'react-use';

export default function DashboardMain({ children }: { children: ReactNode }) {
  const [isShowNav, setIsShowNav] = useState(true);
  const { height, width } = useWindowSize();
  const [clientHeight, setClientHeight] = useState<number | null>(null);
  const [clientHeight, setClientHeight] = useState<number | null>(null);

  // Set height only after mounting to avoid hydration errors
  useEffect(() => {
    setClientHeight(height);
  }, [height, width]);
  return (
    <div
      className={`flex-1 relative transition-all duration-400`}
      style={{
        paddingLeft: isShowNav ? '262.32px' : '0px',
        height: clientHeight ? `${clientHeight - 60.67}px` : '80vh',
        overflowY: 'auto',
      }}
    >
      {isShowNav && (
        <div
          className={`h-[82%] fixed bg-[#1E1E1E] left-[15px] top-[80.67px] rounded-[10px] px-[15px] pt-[30px] pb-[50px] text-[#fff] text-[16px] max-[1200px]:h-dvh max-[1200px]:top-0 max-[1200px]:left-0`}
          style={{
            height:
              clientHeight && width > 1200
                ? `${clientHeight - 110.67}px`
                : width < 1200
                ? 'dvh'
                : '82%',
          }}
        >
          <div className="flex flex-col justify-between gap-[35px] h-full relative">
            <div className="flex flex-col gap-[20px] overflow-y-auto h-[288px] scrollbar-thin scrollbar-thumb-white scrollbar-track-[transparent]">
              <NavLink
                href={'/dashboard'}
                className="flex items-center gap-[10px] hover:opacity-[100]"
              >
                <DashboardIcon /> <span>Dashboard</span>
              </NavLink>
              <NavLink
                href={'/dashboard/manageEvents'}
                className="flex items-center gap-[10px] hover:opacity-[100]"
              >
                <CalenderIcon /> <span>Manage Events</span>
              </NavLink>
              <NavLink
                href={'/dashboard/liveTranslation'}
                className="flex items-center gap-[10px] hover:opacity-[100]"
              >
                <MicIcon /> <span>Live Translation</span>
              </NavLink>
              <NavLink
                href={'/dashboard/pastTranslations'}
                className="flex items-center gap-[10px] hover:opacity-[100]"
              >
                <PastIcon /> <span>Past Translations</span>
              </NavLink>
              <NavLink
                href={'/dashboard/attendeeMangement'}
                className="flex items-center gap-[10px] hover:opacity-[100]"
              >
                <PeopleIcon /> <span>Attendee Management </span>
              </NavLink>
              <NavLink
                href={'/dashboard/subscription'}
                className="flex items-center gap-[10px] hover:opacity-[100]"
              >
                <SubscriptionIcon /> <span>Subscription & Billing</span>
              </NavLink>
              <NavLink
                href={'/dashboard/settings'}
                className="flex items-center gap-[10px] hover:opacity-[100]"
              >
                <SettingsIcon /> <span>Settings</span>
              </NavLink>
            </div>
            <div className="hover:opacity-[100]">
              <span className="flex items-center gap-[10px] cursor-pointer">
                <ExitIcon />{' '}
                <span className="opacity-50 hover:opacity-[100]">Log out</span>
              </span>
            </div>
          </div>
        </div>
      )}
      <span
        className={`fixed top-[100px] w-[24px] h-[24px] rounded-full bg-[#FCFCFC] flex justify-center items-center border-gray-400 border-solid border-[1px] cursor-pointer hover:bg-gray-300 max-[1200px]:top-[15px] max-[1200px]:left-[190px]`}
        onClick={() => setIsShowNav((show) => !show)}
        style={{
          left:
            isShowNav && width > 1200
              ? '210px'
              : isShowNav && width < 1200
              ? '200px'
              : '15px',
        }}
      >
        <ChevronLeftRounded />
      </span>
      <div className="max-w-[1000px] mx-auto px-[30px] py-[20px]">
        {children}
      </div>
    </div>
  );
}
