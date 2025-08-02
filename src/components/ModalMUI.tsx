import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { Dispatch, ReactNode, SetStateAction } from "react";
import ModalCancel from "@/app/[lng]/_svgs/ModalCancel";
import useResponsiveSizes from "@/utils/helper/general/useResponsiveSizes";

interface ModalMUIProps {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setAnchorEl?: Dispatch<SetStateAction<boolean>>;
  className?: string;
  children: ReactNode;
}

function ModalMUI({
  isModalOpen,
  setIsModalOpen,
  setAnchorEl,
  className,
  children,
}: ModalMUIProps) {
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
    setAnchorEl?.((prev) => (prev !== false ? false : prev));
    setIsModalOpen((prev) => (prev !== false ? false : prev));
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isModalOpen}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
          sx: {
            backgroundColor: "#0000004D", // Semi-transparent black
            backdropFilter: "blur(4px)", // Apply blur effect
          },
        },
      }}
      className={className || "scrollbar-hide"}
    >
      <Fade in={isModalOpen}>
        <Box sx={style}>
          <div className="relative cursor-pointer">
            <span
              className="absolute -top-4 left-full translate-x-[-50%] hover:opacity-90"
              onClick={() => setIsModalOpen(false)}
            >
              <ModalCancel />
            </span>
          </div>
          {children}
        </Box>
      </Fade>
    </Modal>
  );
}

export default ModalMUI;
