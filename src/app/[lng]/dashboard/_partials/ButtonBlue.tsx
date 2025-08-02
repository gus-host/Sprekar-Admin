import { ReactNode } from "react";

export default function ButtonBlue({ children }: { children: ReactNode }) {
  return (
    <button
      className="focus:border-none focus-visible:outline-none px-2 py-2 text-[12px] text-white bg-[#025FF3] font-bold tracking-[-.5px] rounded-sm hover:bg-[#024dc4] flex justify-center items-center gap-2 hover:shadow-blue cursor-pointer"
      style={{
        fontFamily: "Helvetica Compressed, sans-serif",
      }}
    >
      {children}
    </button>
  );
}
