'use client';
import React from 'react';
import Button from '@/components/Button';
import TextInput from '@/app/_partials/TextInputs';
import Link from 'next/link';
import { useFormik } from 'formik';
import { loginValidationSchema } from '../loginValidation';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const loginFormIk = useFormik({
    validationSchema: loginValidationSchema,
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: (values) => {
      router.push('/dashboard');
    },
  });
  return (
    <form onSubmit={loginFormIk.handleSubmit}>
      <div className="mb-[20px]">
        <h2 className="text-[20px] font-bold">Welcome Back</h2>
        <p className="text-[12px] font-medium text-[#9B9B9B]">
          Don’t have an account?{' '}
          <Link className="text-[#0255DA] hover:underline" href={'/'}>
            Sign Up
          </Link>
        </p>
      </div>
      <div className="flex flex-col gap-[25px] ">
        {/* <TextInput type="text" placeholder="Name" error={false} /> */}
        <TextInput
          type="email"
          name="email"
          placeholder="Email Address"
          value={loginFormIk.values.email}
          onChange={loginFormIk.handleChange}
          error={loginFormIk.submitCount > 0 && loginFormIk.errors.email}
          onBlur={loginFormIk.handleBlur}
        />
        <TextInput
          type="password"
          name="password"
          placeholder="Password"
          showPasswordToggle
          value={loginFormIk.values.password}
          onChange={loginFormIk.handleChange}
          error={loginFormIk.submitCount > 0 && loginFormIk.errors.password}
          onBlur={loginFormIk.handleBlur}
        />
      </div>
      <div className="flex justify-between items-center mt-3 mb-[40px] text-[#000000] text-[12px]">
        <div className="flex items-center gap-1">
          <input type="checkbox" /> <span>Remember me</span>
        </div>
        <Link
          href={'/forgotPassword'}
          className="hover:underline hover:font-medium"
        >
          Forgot password?
        </Link>
      </div>

      <div className="flex flex-col gap-[16px]">
        <Button text={'Log in'} classNames="rounded-[5px]" type="submit" />
      </div>
    </form>
  );
}
