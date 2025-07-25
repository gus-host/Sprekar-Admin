"use client";

import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import Portal from "@mui/material/Portal";
import MicIcon from "@mui/icons-material/Mic";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { SpeakerIcon } from "lucide-react"; // swap in your own icon
import "./LiveTip.css"; // (see CSS below)

import useResponsiveSizes from "@/utils/helper/general/useResponsiveSizes";
import { cn } from "@/lib/utils";

type Anchor = "right";

export default function MobileTranscriptionPortal({
  transcriptions,
}: {
  transcriptions: string;
}) {
  const [isShowPopOver, setIsShowPopOver] = React.useState(true);
  const [state, setState] = React.useState({
    right: false,
  });
  const fullscreenEl =
    typeof document !== "undefined"
      ? document.querySelector<HTMLElement>(".fullscreen")
      : null;
  const { clientWidth } = useResponsiveSizes();
  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: 0.8 * (clientWidth as number) }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <h2 className="text-center text-[14px] font-extrabold py-4 border-b border-b-gray-50">
        Transcriptions
      </h2>
      <div className="overflow-y-auto overflow-hidden p2 px-2 py-4">
        {transcriptions ? (
          <p className="text-[12px]">{transcriptions}</p>
        ) : (
          <p className="text-[12px] text-center"> No Transcriptions yet</p>
        )}
      </div>
    </Box>
  );

  return (
    <Portal container={() => document.querySelector(".fullscreen")}>
      <div className="inline-block absolute top-0 right-0">
        {(["right"] as const).map((anchor) => (
          <React.Fragment key={anchor}>
            <Button onClick={toggleDrawer(anchor, true)}>
              <span
                className={cn(
                  "relative",
                  (clientWidth as number) > 915 ? "" : "view-transcriptions"
                )}
              >
                {transcriptions && (
                  <div className="absolute -right-1 -top-1 w-[15px] h-[15px] bg-[#0255DA] rounded-full"></div>
                )}
                <MicIcon color="primary" fontSize="large" />
              </span>
            </Button>
            <DropdownMenu.Root
              open={isShowPopOver}
              onOpenChange={() => {
                setIsShowPopOver((show) => !show);
              }}
              modal={false}
            >
              <DropdownMenu.Trigger asChild>
                <div></div>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content
                side="bottom"
                align="start"
                sideOffset={6}
                className="live-tip-content"
              >
                View live transcriptions while you wait for translations.
                <span
                  className="bg-transparent text-white text-[14px] absolute top-0 right-2 cursor-pointer"
                  onClick={() => setIsShowPopOver((show) => !show)}
                >
                  x
                </span>
                <DropdownMenu.Arrow className="live-tip-arrow" />
              </DropdownMenu.Content>
            </DropdownMenu.Root>
            <Drawer
              anchor={anchor}
              open={state[anchor]}
              onClose={toggleDrawer(anchor, false)}
              ModalProps={{
                container: fullscreenEl, // ← render the drawer *inside* .fullscreen
              }}
              sx={{
                zIndex: "1000000",
              }}
            >
              {list(anchor)}
            </Drawer>
          </React.Fragment>
        ))}
      </div>
    </Portal>
  );
}
