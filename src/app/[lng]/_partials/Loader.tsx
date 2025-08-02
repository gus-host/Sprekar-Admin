import Spinner from "@/components/ui/Spinner";
import React from "react";

export default function Loader() {
  return (
    <div className="min-h-[60dvh] flex items-center justify-center">
      <Spinner size={40} color="#025FF3" strokeWidth={2} />
    </div>
  );
}
