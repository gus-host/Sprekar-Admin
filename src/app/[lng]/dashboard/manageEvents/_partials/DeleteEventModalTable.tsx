import DeleteIconRed from "@/app/[lng]/_svgs/DeleteIconRed";
import ModalMUI from "@/components/ModalMUI";
import Spinner from "@/components/ui/Spinner";
import React from "react";

export default function DeleteEventModalTable({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  isDeletingEvent,
  handleDelete,
}: {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDeletingEvent: boolean;
  handleDelete: () => Promise<void>;
}) {
  return (
    <ModalMUI
      isModalOpen={isDeleteModalOpen}
      setIsModalOpen={setIsDeleteModalOpen}
    >
      <div className="flex flex-col px-[30px] py-[20px] items-center justify-center text-center">
        <DeleteIconRed />
        <p className="mt-4 text-center leading-[1.5]">
          Are you sure you want to delete this event? This action cannot be
          undone.
        </p>
        <div className="mt-7 flex gap-3 items-center w-full">
          <button
            type="button"
            className="focus-visible:outline-none px-3 py-2 bg-white border border-[#858585] text-[14px] rounded-sm hover:bg-gray-100flex justify-center items-center w-full"
            disabled={isDeletingEvent}
            style={{
              cursor: isDeletingEvent ? "not-allowed" : "pointer",
            }}
            onClick={() => setIsDeleteModalOpen((open) => !open)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="focus:border-none focus-visible:outline-none px-3 py-2 text-[14px] text-white bg-[#FF0000] font-bold tracking-[-1px] rounded-sm hover:bg-[#e60000] flex justify-center items-center gap-3 w-full"
            style={{
              fontFamily: "Helvetica Compressed, sans-serif",
              boxShadow: "0px 0px 6.4px 4px #FF000033",
              cursor: isDeletingEvent ? "not-allowed" : "pointer",
              opacity: isDeletingEvent ? "0.5" : "1",
            }}
            onClick={() => handleDelete()}
          >
            {isDeletingEvent ? (
              <Spinner size={12} color="#fff" strokeWidth={2} />
            ) : (
              ""
            )}
            <span>{isDeletingEvent ? "Deleting" : "Delete"}</span>
          </button>
        </div>
      </div>
    </ModalMUI>
  );
}
