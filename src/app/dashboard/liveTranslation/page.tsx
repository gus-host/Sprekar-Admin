import Image from "next/image";
import StartTranslation from "./_partials/StartTranslation";

export default function page() {
  return (
    <div>
      <h2 className="text-[18px] mb-[40px]">Live Translations</h2>

      <div className="flex justify-between gap-5 bg-[#F1F5FB] rounded-md overflow-hidden border-[transparent] border-2 hover:border-[#025FF3]">
        <div className="flex-1 relative min-w-[400px]">
          <Image
            src={"/translation-screen-img.png"}
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
          <ul className="flex flex-col gap-3 mb-[10px] items-center list-disc text-[#575757] opacity-85 text-[14px] pl-4">
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
          <div className="py-[10px] px-[12px] max-w-[60%] border border-[#025FF34D] bg-[#E4EFFF] rounded flex gap-2 items-center mb-5">
            <input type="checkbox" className="border border-[#E4EFFF]" />
            <p className="text-[14px] text-[#575757]">
              Don not show me this again
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div></div>
            <StartTranslation />
          </div>
        </div>
      </div>
    </div>
  );
}
