'use client';
import GoogleIcon from '@/public/svgs/GoogleIcon';
import AppleIcon from '@/public/svgs/AppleIcon';

export default function AuthButton({ type }: { type: 'google' | 'apple' }) {
  function handleProviderAuth() {
    if (type === 'google') {
    }
  }
  return (
    <div
      className="bg-white w-full py-[10px] flex justify-center border-[#D9D9D9] border-solid border-[1px]"
      onClick={handleProviderAuth}
    >
      <div className="flex items-center gap-[10px] text-[12px]">
        {type === 'google' && (
          <>
            <GoogleIcon />
            <span>Sign up with Google</span>
          </>
        )}
        {type === 'apple' && (
          <>
            <AppleIcon />
            <span>Sign up with Apple</span>
          </>
        )}
      </div>
    </div>
  );
}
