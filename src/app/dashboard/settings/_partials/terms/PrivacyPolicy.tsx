import React from "react";
import { privacyPolicy } from "../data";

export default function PrivacyPolicy() {
  return (
    <div>
      <ul className="flex flex-col gap-3">
        {privacyPolicy.map((policy, i) => (
          <li key={i} className="text-[10px]">
            <h4 className="text-[#1D1D1D] mb-1">{policy.title}</h4>
            {policy.desc && (
              <p className="text-[#969696] mb-0.5">{policy.desc}</p>
            )}
            {policy.list && (
              <ul className="list-disc text-[#969696] flex flex-col gap-1 pl-3.5">
                {policy.list.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
