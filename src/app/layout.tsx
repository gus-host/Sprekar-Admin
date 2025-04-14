import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Sprekar",
    default: "Home | Sprekar",
  },
  description:
    "Instantly translate speech, live events, and conversations in real-time with AI-powered accuracy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID as string}>
      <html lang="en">
        <body className={`${openSans.className} bg-[#FCFCFC]`}>
          <>
            <Toaster position="top-right" />
            {children}
          </>
        </body>
      </html>
    </GoogleOAuthProvider>
  );
}
