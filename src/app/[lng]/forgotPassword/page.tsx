import AuthLayout from "@/app/[lng]/_partials/_layout/AuthLayout";
import ForgotPassword from "./_partials/ForgotPassword";
import { I8nParams } from "../page";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Forgot Password",
};

async function page({ params }: { params: Promise<I8nParams> }) {
  const paramsTest = await params;
  const lng = paramsTest?.lng;

  if (!lng) {
    notFound(); // This will render your not-found.tsx page
  }
  return (
    <AuthLayout>
      <ForgotPassword />
    </AuthLayout>
  );
}

export default page;
