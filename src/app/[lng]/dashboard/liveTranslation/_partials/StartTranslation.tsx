import Link from "next/link";

export default function StartTranslation({
  eventId,
}: {
  eventId?: string | string[];
}) {
  return (
    <>
      {!eventId && (
        <Link
          href={"/dashboard/manageEvents"}
          className="focus:border-none focus-visible:outline-none px-2 py-2 text-[12px] text-white bg-[#025FF3] font-bold tracking-[-.5px] rounded-sm hover:bg-[#024dc4] flex justify-center items-center gap-2"
          style={{
            fontFamily: "Helvetica Compressed, sans-serif",
            boxShadow: "0px 0px 6.4px 4px #0255DA57",
          }}
        >
          Select an event
        </Link>
      )}
      {eventId && (
        <Link
          href={`/dashboard/liveTranslation/${eventId}`}
          className="focus:border-none focus-visible:outline-none px-2 py-2 text-[12px] text-white bg-[#025FF3] font-bold tracking-[-.5px] rounded-sm hover:bg-[#024dc4] flex justify-center items-center gap-2 hover:shadow-blue"
          style={{
            fontFamily: "Helvetica Compressed, sans-serif",
          }}
        >
          Start Translation
        </Link>
      )}
    </>
  );
}
