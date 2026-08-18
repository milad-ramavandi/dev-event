"use client";

import { useCallback, useState } from "react";

const useModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const openModal = useCallback(() => setIsOpen(true), []);

  return {
    isOpen,
    closeModal,
    openModal,
  };
};

export default useModal;
