"use client";

import { deleteEventAction } from "@/actions/event";
import useModal from "@/hooks/useModal";
import { IActionsEventProps } from "@/types";
import { toast } from "react-toastify";
import Modal from "./Modal";
import FormEvent from "./FormEvent";

const ActionsEvent = ({ eventId, slug }: IActionsEventProps) => {
  const { isOpen, openModal, closeModal } = useModal();
  const deleteEventHandler = async (eventId: string) => {
    const { success } = await deleteEventAction(eventId);
    if (success) {
      toast.success("Delete Event Successfully");
    } else {
      toast.error("Delete Event Has Error");
    }
  };

  return (
    <>
      <div className="flex gap-2">
        <button
          type="button"
          className="font-semibold text-[16px] text-[#59DECA] cursor-pointer"
          onClick={openModal}
        >
          Edit
        </button>
        <button
          type="button"
          className="font-semibold text-[16px] text-[#E7F2FF] cursor-pointer"
          onClick={() => deleteEventHandler(eventId)}
        >
          Delete
        </button>
      </div>
      {isOpen && (
        <Modal isOpen={isOpen} openModal={openModal} closeModal={closeModal}>
          <FormEvent mode="edit" slug={slug}/>
        </Modal>
      )}
    </>
  );
};

export default ActionsEvent;
