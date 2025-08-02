import OneIcon from "@/app/[lng]/_svgs/OneIcon";
import joinScannerImg from "../../../assets/JoinScannerImg.png";
import joinLanguagesSelectImg from "../../../assets/JoinLanguagesSelectImg.png";
import joinLiveTranslationImg from "../../../assets/JoinLiveTranslationImg.png";
import joinSpeakFreelyImg from "../../../assets/JoinSpeakFreelyImg.png";
import joinSummaryImg from "../../../assets/JoinSummaryImg.png";
import hostCreateEventImg from "../../../assets/HostCreateEventImg.png";
import hostLiveTranslation from "../../../assets/HostLiveTranslation.png";
import hostQrcodeImg from "../../../assets/HostQrcodeImg.png";
import featureEventImg from "../../../assets/FeatureEventImgLarge.png";
import featureRealTimeImgLarge from "../../../assets/FeatureRealTimeImgLarge.png";
import featureSummaryImgLarge from "../../../assets/FeatureSummaryImgLarge.png";
import TwoIcon from "@/app/[lng]/_svgs/TwoIcon";
import ThreeIcon from "@/app/[lng]/_svgs/ThreeIcon";
import FourIcon from "@/app/[lng]/_svgs/FourIcon";
import FiveIcon from "@/app/[lng]/_svgs/FiveIcon";
import { StaticImageData } from "next/image";
import React from "react";
import FeatureIdentifier1 from "@/app/[lng]/_svgs/FeatureIdentifier1";
import FeatureIdentifier2 from "@/app/[lng]/_svgs/FeatureIdentifier2";
import FeatureIdentifier3 from "@/app/[lng]/_svgs/FeatureIdentifier3";

export type Steps = {
  title: string;
  desc: string;
  img: StaticImageData;
  stepNum: React.JSX.Element;
  alt?: string;
};
export type Feature = {
  id?: string;
  title: string;
  desc: string;
  img: StaticImageData;
  ident: React.JSX.Element;
  btn: string | null;
  alt: string;
};

export type SubscriptionPlans = {
  plan: string;
  desc: string;
  price: string;
  period: string;
  features: string[];
};

export const joinEventSteps: Steps[] = [
  {
    title: "Scan or Enter an Event Code",
    desc: "Join live events instantly by scanning a QR code or entering an event code. No hassle, no delays.",
    img: joinScannerImg,
    stepNum: <OneIcon />,
    alt: "Scanner image",
  },
  {
    title: "Select Your Language",
    desc: "Pick the language you want translations in—our AI ensures smooth and accurate communication.",
    img: joinLanguagesSelectImg,
    stepNum: <TwoIcon />,
    alt: "Image showing different languages",
  },
  {
    title: "Experience Live Translations",
    desc: "See real-time subtitles as people speak, or listen to translated speech with our voice-to-voice feature.",
    img: joinLiveTranslationImg,
    stepNum: <ThreeIcon />,
    alt: "Image showing live translation",
  },
  {
    title: "Save & Summarize",
    desc: "Need to revisit important discussions? Save translations or generate AI-powered summaries for later.",
    img: joinSummaryImg,
    stepNum: <FourIcon />,
    alt: "Image showing live translation summary",
  },
  {
    title: "Speak Freely, Anytime",
    desc: "Use one-on-one conversation mode to communicate effortlessly with anyone, anywhere.",
    img: joinSpeakFreelyImg,
    stepNum: <FiveIcon />,
    alt: "Image showing conversation chat room",
  },
];

export const hostEventSteps: Steps[] = [
  {
    title: "Create Your Event",
    desc: "Log in as an Organization Admin, enter your event details, then generate a unique QR Code and Event Code for easy access.",
    img: hostCreateEventImg,
    stepNum: <OneIcon />,
    alt: "Image showing event creation form",
  },
  {
    title: "Invite Participants",
    desc: "Share the QR Code or Event Code with attendees so they can join instantly and experience real-time translations",
    img: hostQrcodeImg,
    stepNum: <TwoIcon />,
    alt: "Image showing event qr code",
  },
  {
    title: "Start Live Translation",
    desc: "Begin speaking naturally while our AI-powered system translates instantly. Attendees will see subtitles or hear translations in their chosen language.",
    img: hostLiveTranslation,
    stepNum: <ThreeIcon />,
    alt: "Image showing live translation room",
  },
];

export const features: Feature[] = [
  {
    id: "feat-1",
    title: "Real-Time Translations",
    desc: "Instant Speech-to-Speech & Speech-to-Text – Talk freely, and let Sprekar translate on the fly.",
    img: featureRealTimeImgLarge,
    ident: <FeatureIdentifier1 />,
    btn: "Join a conversation",
    alt: "Phones showing chat room and conversation",
  },
  {
    id: "feat-2",
    title: "Event Translations",
    desc: "QR Code Event Access – Scan & join live multilingual conversations in seconds.",
    img: featureEventImg,
    ident: <FeatureIdentifier2 />,
    btn: "Join an event",
    alt: "Phones showing join event screen and live translations",
  },
  {
    id: "feat-3",
    title: "AI-Powered Summaries",
    desc: "Missed a Meeting? No Problem. AI generates key takeaways & action points from conversations.",
    img: featureSummaryImgLarge,
    ident: <FeatureIdentifier3 />,
    btn: null,
    alt: "Phones showing summary of translations",
  },
];

export const subscriptionPlans: SubscriptionPlans[] = [
  {
    plan: "Free",
    desc: "Perfect for casual use & trave",
    price: "€0",
    period: "/ month",
    features: [
      "1-on-1 voice translation",
      "Join events as a guest",
      "Limited daily usage",
      "Text translation only",
    ],
  },
  {
    plan: "Pro Plan",
    desc: "Great for everyday conversations",
    price: "€9.99",
    period: "/ month",
    features: [
      "Unlimited personal & group chats",
      "Voice-to-voice translations",
      "Save summaries & conversations",
      "Join any event ",
    ],
  },
  {
    plan: "Event Host Plan",
    desc: "Ideal for churches, conferences & classes",
    price: "€49.00",
    period: "/ month",
    features: [
      "Host live translated events",
      "Dashboard for managing translations",
      "QR & event code access",
      "300 attendees per event",
    ],
  },
];
