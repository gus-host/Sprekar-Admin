import React from "react";
import SettingsBox from "./_partials/SettingsBox";

export const metadata = {
  title: "Settings",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { setting } = await searchParams;
  return (
    <div>
      <h2 className="mb-[50px] text-[18px]">Settings</h2>

      <SettingsBox settings={setting as string | undefined} />
    </div>
  );
}
