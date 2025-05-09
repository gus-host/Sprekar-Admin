import React from "react";
import { Suspense } from "react";
import AuthLayout from "../_partials/_layout/AuthLayout";
import VerifyEmail from "./_partials/VerifyEmail";
import Loader from "../_partials/Loader";

export const metadata = {
  title: "Verify Email",
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
