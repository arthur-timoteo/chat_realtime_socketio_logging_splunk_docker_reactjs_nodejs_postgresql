import './style.css';
import { FaCircleUser, FaTrashCan } from "react-icons/fa6";

interface UserInfosModalProps {
    pkMember: string
}

export function UserInfosModal({ pkMember }: UserInfosModalProps) {

    return (
        <div className="user-infos-modal-area">
            <FaCircleUser />
            <h2>dcdcdcd cdcdcdc dcdcdc</h2>
            <span>dcdc dcdc dcdc</span>
        </div>
    )
}