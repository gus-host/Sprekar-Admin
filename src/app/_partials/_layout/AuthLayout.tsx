import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh ">
      <div className="flex-1 bg-[#D9D9D9]"></div>
      <div className="min-w-[650px] pl-[50px] mt-[90px] mb-[110px] max-[1200px]:min-w-full max-[1200px]:px-[30px]">
        <div className="flex flex-col max-w-[500px] max-[1200px]:mx-auto ">
          {children}
        </div>
      </div>
    </div>
  );
}
