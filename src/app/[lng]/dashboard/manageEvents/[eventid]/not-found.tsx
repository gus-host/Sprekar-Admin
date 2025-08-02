import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60dvh] flex flex-col justify-center items-center text-center">
      <h2 className="font-bold text-[20px]">Not Found</h2>
      <p>This event was not found</p>
      <Link
        className="focus:border-none focus-visible:outline-none px-3 py-2 text-[14px] text-white bg-[#025FF3] font-bold tracking-[-1px] rounded-sm hover:bg-[#024dc4] flex justify-center items-center gap-2 mt-7"
        href="/dashboard/manageEvents"
      >
        Go back to Events
      </Link>
    </div>
  );
}
