import BarChart from "@/components/BarChart";
import NoteIcon from "@/app/_svgs/NoteIcon";
import React from "react";

export default function page() {
  return (
    <div>
      <h2 className="text-[#1E1E1E] text-[22px]">Good morning, John!</h2>
      <p className="text-[#7F7F7F] text-[14px]">Website overview</p>
      <div className="grid grid-cols-6">
        <div className="col-span-4">
          <div>
            <h3>Overview of engagement</h3>
            <NoteIcon />
          </div>
          <div>
            <div>
              <span>3</span>
              <p>Active translation events</p>
            </div>
            <div>
              <span>3</span>
              <p>Total Attendees Connected</p>
            </div>
            <div>
              <span>3</span>
              <p>Total event created</p>
            </div>
          </div>
          <BarChart />
        </div>
        <div>
          <div>
            <h3>Translated languages</h3>
            <NoteIcon />
          </div>
        </div>
      </div>
    </div>
  );
}
