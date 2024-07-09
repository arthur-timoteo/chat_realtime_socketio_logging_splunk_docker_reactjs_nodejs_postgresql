import './style.css';
import { FaCircleUser } from "react-icons/fa6";

type Conversation = {
    name: string,
    last_message: string,
    time_last_message: string
}

function ConversationItem({name, last_message, time_last_message} : Conversation) {
    return (
        <div className="conversation-block">
            <FaCircleUser />
            <div className="conversation-block-infos">
                <div className="conversation-block-infos-line">
                    <h4>{name}</h4>
                    <span>{time_last_message}</span>
                </div>
                <p>{last_message}</p>
            </div>
        </div>
    );
}

export default ConversationItem;