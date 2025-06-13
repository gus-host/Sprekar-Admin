// components/StickyImage.tsx
import React from "react";

interface StickyImageProps {
  src: string;
  alt?: string;
  /** How far from the top of the viewport it should stick (e.g. 'top-0', 'top-24') */
  topClass?: string;
  /** Tailwind width for the container (e.g. 'w-1/2', 'w-[60%]') */
  containerWidthClass?: string;
  /** Tailwind extra classes to apply to the <img> */
  imgClassName?: string;
}

export default function StickyImage({
  src,
  alt = "",
  topClass = "top-0",
  containerWidthClass = "w-1/2",
  imgClassName = "w-full max-w-[300px] rounded-3xl shadow-lg",
}: StickyImageProps) {
  return (
    <div
      className={`
        ${containerWidthClass} 
        flex justify-center items-start 
        sticky ${topClass}
      `}
    >
      <img src={src} alt={alt} className={imgClassName} />
    </div>
  );
}
