import React from "react";
import { Suspense } from "react";
import AuthLayout from "@/app/[lng]/_partials/_layout/AuthLayout";
import VerifyEmail from "./_partials/VerifyEmail";
import Loader from "@/app/[lng]/_partials/Loader";

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
