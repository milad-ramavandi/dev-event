import { IModalProps } from "@/types";
import Xmark from "./Xmark";

const Modal = ({ isOpen, closeModal, openModal, children }: IModalProps) => {
  return (
    <div className="fixed inset-0 min-w-screen min-h-screen flex items-center justify-center z-50">
      <div className="absolute inset-0 w-full h-full bg-gray-900 opacity-90"></div>
      <div className="w-full h-160 md:w-175 flex flex-col gap-1 z-50 mx-6">
        <Xmark onClick={closeModal} />
        <div className="w-full h-full overflow-y-scroll">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
