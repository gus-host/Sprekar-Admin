'use client';

import TextInput from '@/app/_partials/TextInputs';
import Button from '@/components/Button';
import { useFormik } from 'formik';
import React from 'react';
import { validationSchema } from '../validation';

export default function ForgotPassword() {
  const formIk = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      email: '',
    },
    onSubmit: (values) => {
      console.log('submited');
    },
  });
  return (
    <form onSubmit={formIk.handleSubmit}>
      <div className="mb-[20px]">
        <h2 className="text-[20px] font-bold">Forgot Password</h2>
        <p className="text-[12px] font-medium text-[#9B9B9B] mt-1 leading-[1.3]">
          Please enter the email associated with your account, kindly click on
          the clink to reset your password.
        </p>
      </div>
      <div className="flex flex-col gap-[25px] mb-10 ">
        <TextInput
          type="email"
          name="email"
          placeholder="Email Address"
          value={formIk.values.email}
          onChange={formIk.handleChange}
          error={formIk.submitCount > 0 && formIk.errors.email}
          onBlur={formIk.handleBlur}
        />
      </div>

      <div className="flex flex-col gap-[16px]">
        <Button text={'Submit'} classNames="rounded-[5px]" type="submit" />
      </div>
    </form>
  );
}
