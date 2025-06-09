// pages/index.tsx (or app/page.tsx)

import StickyImage from "@/components/StickyImage";
import featureEventImg from "../../assets/FeatureEventImgLarge.png";

export default function page() {
  return (
    <div className="relative mx-auto max-w-6xl py-24 flex gap-12 h-dvh overflow-auto">
      {/* Left column (scrollable content) */}
      <div className="w-1/2 space-y-32">
        {/* Put your Scrollama/steps here */}
        <div className="h-screen bg-gray-50">Step 1 content…</div>
        <div className="h-screen bg-gray-100">Step 2 content…</div>
        <div className="h-screen bg-gray-200">Step 3 content…</div>
      </div>

      {/* Right column (sticky image) */}
      <StickyImage
        src={"/FeatureEventImgLarge.png"}
        alt="Feature screenshot"
        topClass="top-24" // sticks 6rem from top
        containerWidthClass="w-1/2" // takes half parent width
        imgClassName="w-full max-w-xs border border-gray-200 rounded-3xl shadow-xl transition-opacity duration-300"
      />
    </div>
  );
}
