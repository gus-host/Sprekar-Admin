'use client';
import { useFormik } from 'formik';
import React from 'react';
import Link from 'next/link';
import TextInput from '@/app/_partials/TextInputs';
import Button from '@/components/Button';
import AuthButton from '../_partials/AuthButton';
import { signupValidationSchema } from './signupValidationSchema';

export default function SignUp() {
  const signupFormIk = useFormik({
    validationSchema: signupValidationSchema,
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values) => {
      console.log('submited');
    },
  });
  return (
    <form onSubmit={signupFormIk.handleSubmit}>
      <div className="mb-[20px]">
        <h2 className="text-[20px] font-bold">Let’s Get Started</h2>
        <p className="text-[12px] font-medium text-[#9B9B9B]">
          Already have an account?{' '}
          <Link className="text-[#0255DA] hover:underline" href={'/login'}>
            Login
          </Link>
        </p>
      </div>
      <div className="flex flex-col gap-[25px] mb-[40px]">
        {/* <TextInput type="text" placeholder="Name" error={false} /> */}
        <TextInput
          type="email"
          name="email"
          placeholder="Email Address"
          value={signupFormIk.values.email}
          onChange={signupFormIk.handleChange}
          error={signupFormIk.submitCount > 0 && signupFormIk.errors.email}
          onBlur={signupFormIk.handleBlur}
        />
        <TextInput
          type="password"
          name="password"
          placeholder="Password"
          showPasswordToggle
          value={signupFormIk.values.password}
          onChange={signupFormIk.handleChange}
          error={signupFormIk.submitCount > 0 && signupFormIk.errors.password}
          onBlur={signupFormIk.handleBlur}
        />
      </div>

      <div className="flex flex-col gap-[16px]">
        <Button text={'Next'} classNames="rounded-[50px]" type="submit" />
      </div>

      <div className="min-h-[20px] text-center relative text-[#D9D9D9] font-medium text-[14px] my-[10px]">
        <div className="absolute border-b-[1px] border-[#D9D9D9] top-[50%] left-[0] min-w-[45%] translate-y-[-50%]"></div>
        OR
        <div className="absolute border-b-[1px] border-[#D9D9D9] top-[50%] right-[0] min-w-[45%] translate-y-[-50%]"></div>
      </div>

      <div className="flex flex-col gap-[15px]">
        <AuthButton type="apple" />
        <AuthButton type="google" />
      </div>
      <div className="text-[#747474] text-[12px] flex items-center gap-1 mt-2 font-medium ">
        <input type="checkbox" />{' '}
        <span>
          {' '}
          I have read, understood and agreed to the{' '}
          <Link className="text-[#0255DA] hover:underline" href={'#'}>
            Terms & Conditions
          </Link>{' '}
          and{' '}
          <Link className="text-[#0255DA] hover:underline" href={'#'}>
            Privacy Policy
          </Link>
        </span>
      </div>
    </form>
  );
}
