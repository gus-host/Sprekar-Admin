import Link from "next/link";
import HomePageLayout from "@/app/[lng]/_partials/_layout/HomePageLayout";
import { Construction } from "lucide-react";
import { I8nParams } from "./page";
export const metadata = {
  title: "Page Not Found",
  description:
    "The page you're looking for doesn't exist or is under construction.",
};

export default async function NotFound({ params }: { params: I8nParams }) {
  const { lng } = await params;
  return (
    <HomePageLayout showedHeroBg={false} lng={lng}>
      <div className="min-h-[80vh] relative max-[750px]:pt-[80px] pb-[100px] flex">
        <div className="relative z-10 grow-1">
          <main className="flex items-center justify-center px-4 h-full">
            <div className="text-center space-y-4 max-w-xs w-full">
              <Construction className="mx-auto w-16 h-16 text-gray-500" />
              <h1 className="text-3xl font-bold">Coming Soon</h1>
              <p className="text-gray-600">
                This page is under construction or does not exist. Please check
                back later!
              </p>
              <Link
                href="/"
                className="inline-block mt-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                Return Home
              </Link>
            </div>
          </main>
        </div>
      </div>
    </HomePageLayout>
  );
}
