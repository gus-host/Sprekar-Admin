import React from "react";
import GeneralSettings from "./GeneralSettings";
import NotificationSettings from "./notifications/NotificationSettings";
import SecuritySettings from "./security/SecuritySettings";
import ContactUsSettings from "./contact-us/ContactUsSettings";
import TermsAndPolicy from "./terms/TermsAndPolicy";

export default function SettingsDisplay({
  activeSetting,
}: {
  activeSetting: number;
}) {
  switch (activeSetting) {
    case 0:
      return <GeneralSettings />;
    case 1:
      return <NotificationSettings />;
    case 2:
      return <SecuritySettings />;
    case 3:
      return <ContactUsSettings />;
    case 4:
      return <TermsAndPolicy />;

    default:
      return <GeneralSettings />;
  }
}
