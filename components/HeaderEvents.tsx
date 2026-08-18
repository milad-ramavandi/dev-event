"use client";

import useModal from "@/hooks/useModal";
import Modal from "./Modal";
import FormEvent from "./FormEvent";

const HeaderEvents = () => {
  const { isOpen, openModal, closeModal } = useModal();
  return (
    <>
      <div className="flex flex-col gap-5 sm:flex-row sm:gap-0 items-center justify-between mb-18">
        <h1 className="text-[40px] sm:text-5xl text-nowrap text-left w-full sm:w-auto">
          Event Management
        </h1>
        <button
          type="button"
          className="w-full sm:w-auto px-4.5 py-2.5 bg-[#59DECA] rounded-xl text-black text-lg cursor-pointer"
          onClick={() => openModal()}
        >
          Add New Event
        </button>
      </div>
      {isOpen && (
        <Modal isOpen={isOpen} closeModal={closeModal} openModal={openModal}>
            <FormEvent/>
        </Modal>
      )}
    </>
  );
};

export default HeaderEvents;
