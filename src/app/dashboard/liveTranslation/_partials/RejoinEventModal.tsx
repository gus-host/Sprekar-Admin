"use client";
import ModalCancel from "@/app/_svgs/ModalCancel";
import useResponsiveSizes from "@/utils/helper/general/useResponsiveSizes";
import { Backdrop, Box, Fade, Modal } from "@mui/material";
import React from "react";

export default function RejoinEventModal({
  isOpen,
  setIsOpen,
  onClick,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClick: () => void;
}) {
  const { clientWidth } = useResponsiveSizes();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: clientWidth && clientWidth >= 1024 ? 600 : 300,
    maxHeight: "90dvh",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 5,
    overflowY: "scroll",
    msOverflowStyle: "none", // For IE and Edge
    "&::-webkit-scrollbar": {
      display: "none", // For Chrome, Safari
    },
    p: 4,
    outline: "none", // Remove default outline
    border: "none", // Remove border
    "&:focus-visible": {
      outline: "none",
      border: "none",
    },
  };

  const handleClose = () => {
    setIsOpen((prev) => (prev !== false ? false : prev));
  };
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isOpen}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      // Ensure the modal is appended to the document body
      // container={document.body}
      disablePortal
      // You can also override the style for z-index if necessary
      sx={{ zIndex: "10000" }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: {
            backgroundColor: "#0000004D", // Semi-transparent black
            backdropFilter: "blur(4px)", // Apply blur effect
          },
        },
      }}
      className={"scrollbar-hide"}
    >
      <Fade in={isOpen}>
        <Box sx={style}>
          <div className="relative cursor-pointer">
            <span
              className="absolute -top-4 left-full translate-x-[-50%] hover:opacity-90"
              onClick={() => setIsOpen(false)}
            >
              <ModalCancel />
            </span>
          </div>
          <div className="flex flex-col px-[30px] py-[20px] items-center justify-center text-center">
            <h2 className="text-[20px] text-[#000] font-medium">
              Are you still there?
            </h2>
            <p className="mt-4 text-[#404040] text-center leading-[1.5]">
              You will need to rejoin the event to proceed
            </p>
            <div className="mt-7 flex gap-3 items-center w-full justify-center">
              <button
                type="button"
                className="focus:border-none focus-visible:outline-none px-3 py-2 text-[14px] text-white bg-[#025FF3] font-bold tracking-[-1px] rounded-sm flex justify-center items-center gap-3 hover:shadow-blue"
                style={{
                  fontFamily: "Helvetica Compressed, sans-serif",
                }}
                onClick={onClick}
              >
                <span>Rejoin event</span>
              </button>
            </div>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}
