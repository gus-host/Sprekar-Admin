import React from "react";
import AuthLayout from "@/app/[lng]/_partials/_layout/AuthLayout";
import Login from "./_partials/Login";

export const metadata = {
  title: "Login",
};

export default function page() {
  return (
    <AuthLayout>
      <Login />
    </AuthLayout>
  );
}
