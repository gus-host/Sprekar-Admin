import AuthLayout from "../_partials/_layout/AuthLayout";
import { Suspense } from "react";
import ResetPassword from "./_partials/ResetPassword";
import Loader from "../_partials/Loader";
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
