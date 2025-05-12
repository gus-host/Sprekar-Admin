import React from "react";
import PastTranslations from "./_partials/PastTranslations";

export const metadata = {
  title: "Past Translations",
};

export default function page() {
  return (
    <div>
      <h2 className="text-[#1E1E1E] text-[22px]">Past translations</h2>
      <PastTranslations />
    </div>
  );
}
