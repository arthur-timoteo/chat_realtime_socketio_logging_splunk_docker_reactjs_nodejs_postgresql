import { ComponentProps, ReactNode } from "react";
import { FaCircleArrowLeft } from "react-icons/fa6";

import './style.css';

interface ModalProps extends ComponentProps<'div'> {
    children: ReactNode,
    closeModal: () => void,
    title: string
}

export function Modal({ children, closeModal, title }: ModalProps) {
    return (
        <div className="modal-fade">
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="modal-header-content-left">
                            <FaCircleArrowLeft onClick={closeModal} className="icon" />
                            <h1>{title}</h1>
                        </div>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}