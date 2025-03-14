import Link from 'next/link';
import AuthLayout from '../_partials/_layout/AuthLayout';
import TextInput from '../_partials/TextInputs';
import Button from '@/components/Button';
import ResetPassword from './_partials/ResetPassword';

export const metadata = {
  title: 'Reset Password',
};

export default function page() {
  return (
    <AuthLayout>
      <ResetPassword />
    </AuthLayout>
  );
}
