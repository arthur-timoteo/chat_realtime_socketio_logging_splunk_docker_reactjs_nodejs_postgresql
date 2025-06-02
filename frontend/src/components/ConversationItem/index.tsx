import './style.css';
import { FaCircleUser } from "react-icons/fa6";

type ConversationItemProps = {
    pk: string,
    title: string,
    last_message: string | null,
    time_last_message: string | null,
    setPkConversationIsShow: (pkConversation: string) => void
}

function ConversationItem({pk, title, last_message, time_last_message, setPkConversationIsShow} : ConversationItemProps) {

    return (
        <div 
            className="conversation-block" 
            onClick={() => setPkConversationIsShow(pk)}
        >
            <FaCircleUser />
            <div className="conversation-block-infos">
                <div className="conversation-block-infos-line">
                    <h4>{title}</h4>

                    {time_last_message && (
                        <span>{time_last_message}</span>
                    )}
                </div>

                {last_message && (
                    <p>{last_message}</p>
                )}
            </div>
        </div>
    );
}

export default ConversationItem;