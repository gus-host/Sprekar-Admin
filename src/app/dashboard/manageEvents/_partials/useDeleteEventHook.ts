import axios from "axios";
import { useState } from "react";
import { EventData } from "./EventTable";
import toast from "react-hot-toast";

function useDeleteEventHook(
  row: EventData,
  setData: React.Dispatch<React.SetStateAction<EventData[]>>,
  id?: string
) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingEvent, setIsDeletingEvent] = useState(false);
  async function handleDelete() {
    console.log(id);
    try {
      setIsDeletingEvent(true);
      const response = await axios.delete(
        id
          ? `/api/event/delete-event?id=${id}`
          : `/api/event/delete-event?id=${row.id}`,

        { withCredentials: true }
      );
      if (response.status === 201 || response.status === 200) {
        console.log(response.data);
        toast.success("Event deleted successfully");
        setData((data) =>
          data.filter((d) => (id ? d.id !== id : d.id !== row.id))
        );
        setIsDeleteModalOpen((open) => !open);
      } else {
        toast.error("An error occured, couldnot delete event");
      }
    } catch (error) {
      if (axios.isAxiosError(error))
        toast.error(error?.response?.data?.message || "An error occured.");
      if (error instanceof Error) console.log(error);
    } finally {
      setIsDeletingEvent(false);
    }
  }
  return {
    isDeleteModalOpen,
    isDeletingEvent,
    handleDelete,
    setIsDeleteModalOpen,
    setIsDeletingEvent,
  };
}
export default useDeleteEventHook;
