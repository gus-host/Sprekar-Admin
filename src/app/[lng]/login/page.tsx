import React from "react";
import AuthLayout from "@/app/[lng]/_partials/_layout/AuthLayout";
import Login from "./_partials/Login";
import { I8nParams } from "../page";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Login",
};

export default async function page({ params }: { params: Promise<I8nParams> }) {
  const paramsTest = await params;
  const lng = paramsTest?.lng;

  if (!lng) {
    notFound(); // This will render your not-found.tsx page
  }
  return (
    <AuthLayout>
      <Login />
    </AuthLayout>
  );
}
