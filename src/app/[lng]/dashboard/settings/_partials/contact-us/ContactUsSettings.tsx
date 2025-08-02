import SettingsMail from "@/app/[lng]/_svgs/SettingsMail";
import SettingsPhone from "@/app/[lng]/_svgs/SettingsPhone";
import React from "react";

export default function ContactUsSettings() {
  return (
    <div className="my-[20px]">
      <div className="text-[14px]">
        <h4 className="text-[#1D1D1D] mb-2">Customer service</h4>
        <p className={"text-[#6F6F6F]"}>
          Get in touch with all your questions about craysoft with out support
          contact
        </p>
      </div>
      <ul className="my-[40px] flex flex-col gap-4">
        <li className="flex gap-3 items-center text-[#1D1D1D] text-[12px]">
          <SettingsPhone />
          <p>+31 6 86452514</p>
        </li>
        <li className="flex gap-3 items-center text-[#1D1D1D] text-[12px]">
          <SettingsMail />
          <p>hello@sprekar.com</p>
        </li>
      </ul>
      <div className="text-[14px]">
        <h4 className="text-[#1D1D1D] mb-2">Need Help?</h4>
        <p className={"text-[#6F6F6F] mb-1.5"}>
          Leave your question or comment here and you will get an email reply
        </p>
        <textarea
          name="questions"
          id="questions"
          placeholder="Enter your question"
          rows={5}
          cols={65}
          className="bg-transparent border border-[#DFDFDF] rounded px-2 py-3 placeholder:text-[#A7A7A7] placeholder:text-[12px]"
        ></textarea>
      </div>

      <button className="border-none border-0 text-[12px] bg-[#0255DA] text-white px-20 py-2 inline-block mt-[40px] hover:bg-[#0238da] cursor-pointer">
        Send
      </button>
    </div>
  );
}
