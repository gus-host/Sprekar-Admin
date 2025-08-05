import React from "react";
import AuthLayout from "@/app/[lng]/_partials/_layout/AuthLayout";
import Signup from "./Signup";
import { I8nParams } from "../page";
import { notFound } from "next/navigation";
export const metadata = {
  title: "Signup",
};
export default async function page({ params }: { params: Promise<I8nParams> }) {
  const paramsTest = await params;
  const lng = paramsTest?.lng;

  if (!lng) {
    notFound(); // This will render your not-found.tsx page
  }
  return (
    <AuthLayout>
      <Signup />
    </AuthLayout>
  );
}
