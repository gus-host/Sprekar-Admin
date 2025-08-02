import React from "react";
import PastTranslationDetails from "./_partials/PastTranslationDetails";
import BreadCrumb from "../../_partials/BreadCrumb";

export const metadata = {
  title: "Past translation details",
};

export default function page() {
  return (
    <div>
      <div className="mb-[40px] max-[790px]:mb-[5px]">
        <BreadCrumb
          links={["Past Translations"]}
          href={["/dashboard/pastTranslations"]}
          active={"AI business technology translation"}
        />
      </div>
      <PastTranslationDetails />
    </div>
  );
}
