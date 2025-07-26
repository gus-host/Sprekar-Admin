// src/context/TourContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import Joyride, { CallBackProps } from "react-joyride";
import { tourSteps } from "../dashboard/_partials/tourSteps";

interface TourContextValue {
  hasCompletedTour: string | boolean | null;
  completeTour: () => void;
  // restartTour: () => void;
}

const TourContext = createContext<TourContextValue | undefined>(undefined);

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [runTour, setRunTour] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("hasSeenTour");
  });
  const [hasCompletedTour, setHasCompletedTour] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("hasSeenTour");
  });

  // const skipBtnForFirstTooltip = typeof document !== "undefined" ? document.q

  const completeTour = useCallback(() => {
    setHasCompletedTour("true");
    setRunTour(false);
    localStorage.setItem("hasSeenTour", "true");
  }, []);

  // const restartTour = useCallback(() => {
  //   setHasCompletedTour("");
  //   setRunTour(true);
  // }, []);

  const handleJoyrideCallback = useCallback(
    (data: CallBackProps) => {
      console.log(data);
      const { status } = data;
      console.log(status);
      if (status === "finished" || status === "skipped") {
        completeTour();
      }
    },
    [completeTour]
  );

  return (
    <TourContext.Provider value={{ hasCompletedTour, completeTour }}>
      {/* 
        You can render Joyride here *or* inside children. 
        Its overlay always covers the full viewport.
      */}
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous
        showSkipButton
        showProgress
        styles={{
          options: {
            zIndex: 10000000,
            overlayColor: "rgba(0, 0, 0, 0.712)",
          },
        }}
        scrollDuration={1000}
        callback={handleJoyrideCallback}
      />
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be inside a TourProvider");
  return ctx;
}
