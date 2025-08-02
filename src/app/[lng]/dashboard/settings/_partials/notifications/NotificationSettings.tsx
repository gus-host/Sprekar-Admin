"use client";

import React, { useState } from "react";
import NotificationSettingsBox from "./NotificationSettingsBox";
import { Helvetica } from "@/app/[lng]/_partials/fontFamilies";

export default function NotificationSettings() {
  const [toggleEmailNotification, setToggleEmailNotification] =
    useState<boolean>(false);
  const [toggleEventNotification, setToggleEventNotification] =
    useState<boolean>(false);
  const [toggleAttendeeNotification, setToggleAttendeeNotification] =
    useState<boolean>(false);
  const [toggleAISummaryNotification, setToggleAISummaryNotification] =
    useState<boolean>(false);
  return (
    <div>
      <div
        className="cursor-pointer"
        onClick={() => setToggleEmailNotification((active) => !active)}
      >
        <NotificationSettingsBox
          type="Email Notification"
          isToggle={toggleEmailNotification}
        />
      </div>
      <div
        className="cursor-pointer"
        onClick={() => setToggleEventNotification((active) => !active)}
      >
        <NotificationSettingsBox
          type="Event  Reminders"
          isToggle={toggleEventNotification}
        />
      </div>
      <div
        className="cursor-pointer"
        onClick={() => setToggleAttendeeNotification((active) => !active)}
      >
        <NotificationSettingsBox
          type="Attendee Join Alerts"
          isToggle={toggleAttendeeNotification}
        />
      </div>
      <div
        className="cursor-pointer"
        onClick={() => setToggleAISummaryNotification((active) => !active)}
      >
        <NotificationSettingsBox
          type="AI Summary Alerts"
          isToggle={toggleAISummaryNotification}
        />
      </div>
      <div className="my-10 flex justify-center">
        <button
          className={`bg-[#025FF3] hover:shadow-[0px_0px_6.4px_4px_#0255DA57] cursor-pointer text-[14px] rounded px-15 py-2 text-white ${Helvetica.className} font-normal tracking-[1px]`}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
