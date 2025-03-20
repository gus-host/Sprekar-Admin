import AuthLayout from "@/app/_partials/_layout/AuthLayout";
import VerifyEmail from "../_partials/VerifyEmailPasswordReset";

export const metadata = {
  title: "Verify Email - Password Reset"
}

export default function page() {
  return (
    <AuthLayout>
      <VerifyEmail />
    </AuthLayout>
  );
}
