import SignUp from "./_home/SignUp";
import AuthLayout from "./_partials/_layout/AuthLayout";

export default function Home() {
  return (
    <AuthLayout>
      <SignUp />
    </AuthLayout>
  );
}
