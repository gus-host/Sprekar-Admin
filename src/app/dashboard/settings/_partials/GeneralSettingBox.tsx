import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export default function GeneralSettingBox({
  title = "locale",
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex justify-between border-b-[#E3E3E3] border-b py-3 items-center">
      <div>
        <h3
          className={cn(
            "text-[#1D1D1D] text=[12px]",
            description ? "mb-1" : "mb-auto"
          )}
        >
          {title}
        </h3>
        {description && (
          <p className="text-[#9C9C9C] text-[12px]">{description}</p>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
