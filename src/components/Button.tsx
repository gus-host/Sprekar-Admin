import { cn } from '@/lib/utils';
import React from 'react';

export default function Button({
  text,
  classNames,
  type,
}: {
  text: string;
  classNames?: string;
  type?: 'submit' | 'reset' | 'button';
}) {
  return (
    <button
      className={cn(
        `w-full bg-[#025FF3] py-[12px] cursor-pointer text-center text-white text-[14px] focus:outline-none focus:border-none`,
        classNames
      )}
      type={type}
    >
      {text}
    </button>
  );
}
