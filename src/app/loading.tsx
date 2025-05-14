// import Spinner from "@/components/ui/Spinner";
import Image from "next/image";

export default function loading() {
  return (
    <div className="flex items-center justify-center h-dvh w-dvw bg-[#FCFCFC]">
      <Image
        src={"/loader.gif"}
        width={200}
        height={200}
        alt="Sprekar loader"
        className="bg-[#FCFCFC]"
        quality={100}
        priority
      />
      {/* <Spinner classNames="" color="#0255da" size={100} strokeWidth={2} /> */}
    </div>
  );
}
