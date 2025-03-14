'use client';

import TextInput from '@/app/_partials/TextInputs';
import Button from '@/components/Button';
import { useFormik } from 'formik';
import Link from 'next/link';
import React from 'react';
import { validationSchema } from '../validation';

export default function ResetPassword() {
  const formIk = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      password: '',
      passwordConfirm: '',
    },
    onSubmit: (values) => {
      console.log('submited');
    },
  });
  return (
    <form onSubmit={formIk.handleSubmit}>
      <div className="mb-[20px]">
        <h2 className="text-[20px] font-bold">Reset Password</h2>
        <p className="text-[12px] mt-1 font-medium text-[#9B9B9B]">
          Please enter your new password
        </p>
      </div>
      <div className="flex flex-col gap-[25px] ">
        <TextInput
          type="password"
          name="password"
          placeholder="Password"
          showPasswordToggle
          value={formIk.values.password}
          onChange={formIk.handleChange}
          error={formIk.submitCount > 0 && formIk.errors.password}
          onBlur={formIk.handleBlur}
        />
        <TextInput
          type="password"
          name="confirm-password"
          placeholder="Re-enter Password"
          showPasswordToggle
          value={formIk.values.passwordConfirm}
          onChange={formIk.handleChange}
          error={formIk.submitCount > 0 && formIk.errors.passwordConfirm}
          onBlur={formIk.handleBlur}
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
        <Button
          text={'Reset Password'}
          classNames="rounded-[5px]"
          type={'submit'}
        />
      </div>
    </form>
  );
}
