import { Step } from "react-joyride";

export const tourSteps: Step[] = [
  {
    target: ".mic-trigger",
    title: "Start or stop recording",
    content: "Click here to start or pause the live audio stream.",
    placement: "auto",
    disableBeacon: true,
  },
  {
    target: ".translation-lang-select",
    title: "Select translation language",
    content:
      "Click here to select the language you want translations to come in.",
    placement: "auto",
  },
  {
    target: ".streaming-lang-select",
    title: "Select streaming language",
    content:
      "Click here to select the language you want to stream in. This should be the language spoken by the speaker at the event.",
    placement: "auto",
  },

  {
    target: ".share-event-code",
    title: "Share event code",
    content: "Click here to get and share the event code for others to join.",
    placement: "auto",
  },
  {
    target: ".select-audio-device",
    title: "Select audio device",
    content:
      "Click here to select the audio device you want to use in recording.",
    placement: "auto",
  },
  {
    target: ".view-full-screen",
    title: "Full screen mode",
    content: "Click here to view in full screen mode.",
    placement: "auto",
  },
  {
    target: ".view-translations",
    title: "View translations",
    content:
      "View translations in the desired language you chose amongst the supported languages",
    placement: "auto",
  },
  {
    target: ".view-transcriptions",
    title: "View transcriptions",
    content:
      "View transcriptions in the language spoken by the speaker at the event.",
    placement: "auto",
  },
  {
    target: ".end-event",
    title: "End event",
    content: "Click here to end the event.",
    placement: "auto",
  },
];
export const tourStepsVisitors: Step[] = [
  {
    target: ".translation-lang-select",
    title: "Select translation language",
    content:
      "Click here to select the language you want translations to come in.",
    placement: "auto",
  },

  {
    target: ".view-full-screen",
    title: "Full screen mode",
    content: "Click here to view in full screen mode.",
    placement: "auto",
  },
  {
    target: ".view-translations",
    title: "View translations",
    content:
      "View translations in the desired language you chose amongst the supported languages",
    placement: "auto",
  },
  {
    target: ".view-transcriptions",
    title: "View transcriptions",
    content:
      "View transcriptions in the language spoken by the speaker at the event.",
    placement: "auto",
  },
  {
    target: ".leave-event",
    title: "Leave event",
    content: "Click here to leave the event.",
    placement: "auto",
  },
];
