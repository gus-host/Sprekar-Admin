import AuthLayout from "@/app/[lng]/_partials/_layout/AuthLayout";
import { Suspense } from "react";
import ResetPassword from "./_partials/ResetPassword";
import Loader from "@/app/[lng]/_partials/Loader";
export const metadata = {
  title: "Reset Password",
};

export default function page() {
  return (
    <AuthLayout>
      <Suspense fallback={<Loader />}>
        <ResetPassword />
      </Suspense>
    </AuthLayout>
  );
}
