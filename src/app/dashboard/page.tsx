import BarChart from "@/components/BarChart";
import DonutChart from "@/components/DonutChart";
import NoteIcon from "@/public/svgs/NoteIcon";
import React from "react";

export const validate = 0;

export default function page() {
  return (
    <div>
      <h2 className="text-[#1E1E1E] text-[22px]">Good morning, John!</h2>
      <p className="text-[#7F7F7F] text-[14px]">Website overview</p>
      <div className="grid grid-cols-6 min-w-[100%] gap-x-[20px] my-[40px]">
        <div className="col-span-4 bg-white py-3 px-[15px] rounded-[10px] border border-[#C6C6C6]">
          <div className="flex gap-2 items-center text-[#1E1E1E] text-[17px]">
            <h3>Overview of engagement</h3>
            <NoteIcon />
          </div>
          <div className="grid grid-cols-3 gap-x-[10px] mt-3 mb-5">
            <div className="text-center border border-[#E2E2E2] px-[10px] py-[15px]">
              <span className="text-[#0827F6] py-[8px] px-[14px] font-semibold rounded-full bg-[#025FF312] inline-block text-[14px] mb-2">
                3
              </span>
              <p className="text-[12px] text-[#7F7F7F]">
                Active translation events
              </p>
            </div>
            <div className="text-center border border-[#E2E2E2] px-[10px] py-[15px]">
              <span className="text-[#0827F6] py-[8px] px-[14px] font-semibold rounded-full bg-[#025FF312] inline-block text-[14px] mb-2">
                3
              </span>
              <p className="text-[12px] text-[#7F7F7F]">
                Total Attendees Connected
              </p>
            </div>
            <div className="text-center border border-[#E2E2E2] px-[10px] py-[15px]">
              <span className="text-[#0827F6] py-[8px] px-[14px] font-semibold rounded-full bg-[#025FF312] inline-block text-[14px] mb-2">
                3
              </span>
              <p className="text-[12px] text-[#7F7F7F]">Total event created</p>
            </div>
          </div>
          <BarChart />
        </div>
        <div className="col-span-2 bg-white py-3 px-[15px] rounded-[10px] border border-[#C6C6C6]">
          <div className="flex gap-2 items-center text-[#1E1E1E] text-[17px] mb-7">
            <h3>Translated languages</h3>
            <NoteIcon />
          </div>
          <DonutChart />
        </div>
        <div className="col-span-4 bg-white py-3 px-[15px] rounded-[10px] border border-[#C6C6C6]">
          <div className="flex gap-2 items-center text-[#1E1E1E] text-[17px]">
            <h3>Overview of engagement</h3>
            <NoteIcon />
          </div>
        </div>
      </div>
    </div>
  );
}
