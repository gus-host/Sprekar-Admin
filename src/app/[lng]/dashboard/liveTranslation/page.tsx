import Image from "next/image";
import StartTranslation from "./_partials/StartTranslation";
import PlayIconOutline from "@/app/[lng]/_svgs/PlayIconOutline";
import QuestionMarkOutline from "@/app/[lng]/_svgs/QuestionMarkOutline";
import translationImg from "/public/translation-screen-img.png";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export const metadata = {
  title: "live Translation",
};

export default async function page(props: { searchParams: SearchParams }) {
  const { eventId } = await props.searchParams;
  console.log(eventId);
  return (
    <div>
      <h2 className="text-[18px] mb-[40px]">Live Translations</h2>

      <div className="flex justify-between gap-5 bg-[#F1F5FB] rounded-md overflow-hidden border-[transparent] border-2 hover:border-[#025FF3]">
        <div className="flex-1 relative min-w-[400px] max-[930px]:hidden ">
          <Image
            src={translationImg}
            alt="Translation illustration"
            fill
            className="object-cover object-center"
            quality={100}
          />
        </div>
        <div className="px-[15px] py-[20px]">
          <h3 className="font-medium mb-[20px]">
            Enables translation to any language
          </h3>
          <ul className="flex flex-col gap-3 mb-[10px] items-center list-disc text-[#575757] opacity-85 text-[14px] pl-4 max-[930px]:items-start">
            <li>
              Translate your content into any language, reaching a global
              audience and connecting with users worldwide.
            </li>
            <li>
              Utilize advanced translation technology to ensure accurate and
              efficient translations, saving time and resources.
            </li>
            <li>
              Enable real-time communication with users who speak different
              languages, facilitating seamless interactions and enhancing
              user experience.
            </li>
          </ul>
          <div className="py-[10px] px-[12px] max-w-[60%] border border-[#025FF34D] bg-[#E4EFFF] rounded flex gap-2 items-center mb-5 max-[500px]:max-w-[80%]">
            <input type="checkbox" className="border border-[#E4EFFF]" />
            <p className="text-[12px] text-[#575757]">
              Don not show me this again
            </p>
          </div>
          <div className="flex items-center gap-3 max-[500px]:flex-col max-[500px]:items-start">
            <div className="flex gap-2">
              <button className="outline-none focus-within:border-border-[#C3C3C3] border border-[#C3C3C3] bg-[#EBEBEB] flex gap-1 text-[12px] items-center py-1 px-2  rounded hover:cursor-pointer hover:bg-gray-200">
                <PlayIconOutline /> <span>Watch Demo</span>
              </button>
              <button className="outline-none focus-within:border-border-[#C3C3C3] border border-[#C3C3C3] bg-[#EBEBEB] flex gap-1 text-[12px] items-center py-1 px-2  rounded hover:cursor-pointer hover:bg-gray-200">
                <QuestionMarkOutline /> <span>Watch Demo</span>
              </button>
            </div>
            <StartTranslation eventId={eventId} />
          </div>
        </div>
      </div>
    </div>
  );
}
