import { Open_Sans } from "next/font/google";
import "./globals.css";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { dir } from "i18next";
import { fallbackLng, languages } from "../i18n/settings";
import { useTranslation } from "../i18n";

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lng: string }>;
}) {
  let { lng } = await params;
  if (languages.indexOf(lng) < 0) lng = fallbackLng;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lng);
  return {
    title: {
      template: "%s | Sprekar",
      default: "Home | Sprekar",
    },
    description:
      "Instantly translate speech, live events, and conversations in real-time with AI-powered accuracy",
    verification: {
      google: "fNO-1fdMHzhCv02tq6LzpNQ39FZDxoQs2-ggdE6oZwY",
    },
  };
}

// export const metadata: Metadata = {
//   title: {
//     template: "%s | Sprekar",
//     default: "Home | Sprekar",
//   },
//   description:
//     "Instantly translate speech, live events, and conversations in real-time with AI-powered accuracy",
//   verification: {
//     google: "fNO-1fdMHzhCv02tq6LzpNQ39FZDxoQs2-ggdE6oZwY",
//   },
// };

// After
type Params = Promise<{ lng: string }>;

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Params;
}>) {
  const { lng } = await params;
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID as string}>
      <html lang={lng} dir={dir(lng)}>
        <body className={`${openSans.className} bg-[#FCFCFC]`}>
          <>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  fontSize: "14px",
                },
              }}
            />
            {children}
          </>
        </body>
      </html>
    </GoogleOAuthProvider>
  );
}
