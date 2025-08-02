import React from "react";
import AuthLayout from "@/app/[lng]/_partials/_layout/AuthLayout";
import Signup from "./Signup";
export const metadata = {
  title: "Signup",
};
export default function page() {
  return (
    <AuthLayout>
      <Signup />
    </AuthLayout>
  );
}
