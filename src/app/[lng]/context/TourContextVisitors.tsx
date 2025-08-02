// src/context/TourContext.tsx
"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import Joyride, { CallBackProps } from "react-joyride";
import { tourStepsVisitors } from "@/app/[lng]/dashboard/_partials/tourSteps";

interface TourContextValue {
  hasCompletedTourVisitor: string | boolean | null;
  completeTour: () => void;
  // restartTour: () => void;
}

const TourContext = createContext<TourContextValue | undefined>(undefined);

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [runTour, setRunTour] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("hasSeenTour");
  });
  const [hasCompletedTourVisitor, setHasCompletedTourVisitor] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("hasSeenTour");
  });

  const completeTour = useCallback(() => {
    setHasCompletedTourVisitor("true");
    setRunTour(false);
    localStorage.setItem("hasSeenTour", "true");
  }, []);

  // const restartTour = useCallback(() => {
  //   setHasCompletedTour("");
  //   setRunTour(true);
  // }, []);

  const handleJoyrideCallback = useCallback(
    (data: CallBackProps) => {
      const { status } = data;
      if (status === "finished" || status === "skipped") {
        completeTour();
      }
    },
    [completeTour]
  );

  return (
    <TourContext.Provider value={{ hasCompletedTourVisitor, completeTour }}>
      {/* 
        You can render Joyride here *or* inside children. 
        Its overlay always covers the full viewport.
      */}
      <Joyride
        steps={tourStepsVisitors}
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
        callback={handleJoyrideCallback}
        disableScrolling={true}
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
