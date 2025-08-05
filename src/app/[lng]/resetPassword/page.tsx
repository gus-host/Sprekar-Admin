import AuthLayout from "@/app/[lng]/_partials/_layout/AuthLayout";
import { Suspense } from "react";
import ResetPassword from "./_partials/ResetPassword";
import Loader from "@/app/[lng]/_partials/Loader";
import { I8nParams } from "../page";
import { notFound } from "next/navigation";
export const metadata = {
  title: "Reset Password",
};

export default async function page({ params }: { params: Promise<I8nParams> }) {
  const paramsTest = await params;
  const lng = paramsTest?.lng;

  if (!lng) {
    notFound(); // This will render your not-found.tsx page
  }
  return (
    <AuthLayout>
      <Suspense fallback={<Loader />}>
        <ResetPassword />
      </Suspense>
    </AuthLayout>
  );
}
