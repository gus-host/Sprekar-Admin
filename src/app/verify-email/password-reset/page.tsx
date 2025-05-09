import AuthLayout from "@/app/_partials/_layout/AuthLayout";
import VerifyEmail from "../_partials/VerifyEmailPasswordReset";
import { Suspense } from "react";
import Loader from "@/app/_partials/Loader";

export const metadata = {
  title: "Verify Email - Password Reset",
};

export default function page() {
  return (
    <AuthLayout>
      <Suspense fallback={<Loader />}>
        <VerifyEmail />
      </Suspense>
    </AuthLayout>
  );
}
