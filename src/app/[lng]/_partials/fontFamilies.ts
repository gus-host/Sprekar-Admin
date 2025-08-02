import { Open_Sans } from "next/font/google";
import { Roboto_Serif } from "next/font/google";
import { Nunito_Sans } from "next/font/google";
import localFont from "next/font/local";

export const Helvetica = localFont({
  src: "../../../../public/fonts/Helvetica Compressed Regular.otf",
});

export const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
});
export const robotoSerif = Roboto_Serif({
  subsets: ["latin"],
  display: "swap",
});

export const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
});
