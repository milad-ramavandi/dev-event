"use client";

import { deleteEventAction } from "@/actions/event";
import { IActionsEventProps } from "@/types";

const ActionsEvent = ({ eventId }: IActionsEventProps) => {
  const deleteEventHandler = async (eventId: string) => {
    const { success } = await deleteEventAction(eventId);
    if (success) {
      alert("Delete Event Successfully");
    } else {
      alert("Delete Event Has Error");
    }
  };
  return (
    <div className="flex gap-2">
      <button
        type="button"
        className="font-semibold text-[16px] text-[#59DECA] cursor-pointer"
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
  );
};

export default ActionsEvent;
