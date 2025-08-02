'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import dynamic from 'next/dynamic';

const User = dynamic(() => import('lucide-react').then((mod) => mod.User));
const Mail = dynamic(() => import('lucide-react').then((mod) => mod.Mail));
const Lock = dynamic(() => import('lucide-react').then((mod) => mod.Lock));

export default function TextInput({
  type,
  placeholder,
  showPasswordToggle,
  error,
  value,
  name,
  onBlur,
  onFocus,
  onChange,
}: {
  type: string;
  placeholder?: string;
  showPasswordToggle?: boolean;
  error?: boolean | string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <div className="relative flex items-center bg-white">
        <div className="absolute left-3 text-gray-500">
          {type === 'text' && <User size={16} />}
          {type === 'email' && <Mail size={16} />}
          {type === 'password' && <Lock size={16} />}
        </div>
        <Input
          type={showPasswordToggle && showPassword ? 'text' : type}
          placeholder={placeholder}
          error={error}
          name={name}
          value={value}
          onBlur={onBlur}
          onChange={onChange}
          onFocus={onFocus}
          className={`pl-10 pr-10 ${
            error &&
            'focus-visible:border-[#FF0000] focus:outline-none focus:border-[#FF0000] border-[#FF0000]'
          }`}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {!showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="pt-[5px] text-red-500 text-[12px]">{error}</p>}
    </div>
  );
}
