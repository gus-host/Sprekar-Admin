import React from "react";
import { termsOfService } from "../data";

export default function TermsOfService() {
  return (
    <div>
      <ul className="flex flex-col gap-3">
        {termsOfService.map((term, i) => (
          <li key={i} className="text-[10px]">
            <h4 className="text-[#1D1D1D] mb-1">{term.title}</h4>
            {term.desc && <p className="text-[#969696] mb-0.5">{term.desc}</p>}
            {term.list && (
              <ul className="list-disc text-[#969696] flex flex-col gap-1 pl-3.5">
                {term.list.map((item, i) => (
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
