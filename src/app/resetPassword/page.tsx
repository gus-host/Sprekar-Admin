import AuthLayout from "../_partials/_layout/AuthLayout";
import ResetPassword from "./_partials/ResetPassword";
export const metadata = {
  title: "Reset Password",
};

export default function page() {
  return (
    <AuthLayout>
      <ResetPassword />
    </AuthLayout>
  );
}
