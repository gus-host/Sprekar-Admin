import AuthLayout from '@/app/_partials/_layout/AuthLayout';
import ForgotPassword from './_partials/ForgotPassword';

export const metadata = {
  title: 'Forgot Password',
};

function page() {
  return (
    <AuthLayout>
      <ForgotPassword />
    </AuthLayout>
  );
}

export default page;
