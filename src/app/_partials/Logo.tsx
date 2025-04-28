import SprekarLogo from "@/app/_svgs/SprekarLogo";
import SprekarLogoHome from "../_svgs/SprekarLogoHome";
import { Roboto_Serif } from "next/font/google";

const robotoSerif = Roboto_Serif({
  subsets: ["latin"],
  display: "swap",
});

export default function Logo({
  color = "font-black",
  type = "auth-logo",
}: {
  color?: string;
  type?: "home-logo" | "auth-logo";
}) {
  return (
    <span className="flex items-center gap-2 py-[1px]">
      {type === "auth-logo" ? <SprekarLogo /> : <SprekarLogoHome />}{" "}
      <span className={`text-[20px] ${robotoSerif.className} ${color}`}>
        Sprekar
      </span>
    </span>
  );
}
