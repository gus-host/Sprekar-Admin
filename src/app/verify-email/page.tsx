import React from "react";
import AuthLayout from "../_partials/_layout/AuthLayout";
import VerifyEmail from "./_partials/VerifyEmail";

export const metadata = {
  title: "Verify Email"
}

export default function page() {
  return (
    <AuthLayout>
      <VerifyEmail />
    </AuthLayout>
  );
}
