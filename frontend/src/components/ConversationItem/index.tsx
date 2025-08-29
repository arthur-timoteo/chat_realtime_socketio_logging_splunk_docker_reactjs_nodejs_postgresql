import './style.css';
import { FaCircleUser } from "react-icons/fa6";
import { format } from 'date-fns';

type ConversationItemProps = {
    pk_logged_member: string,
    conversation: Conversation,
    setConversationIsShow: (conversation: ConversationActive) => void
}

interface ConversationActive {
    pk: string | undefined,
    title: string | undefined,
    isGroup: boolean | undefined
}

interface Conversation {
    pk: string,
    title: string,
    last_message_sender_pk: string | null,
    last_message_sender: string | null,
    last_message_text: string | null,
    last_message_time: string | null,
    type_conversation: boolean
}

function ConversationItem({pk_logged_member, conversation, setConversationIsShow} : ConversationItemProps) {

    return (
        <div 
            className="conversation-block" 
            onClick={() => setConversationIsShow({pk: conversation.pk, title: conversation.title, isGroup: conversation.type_conversation})}
        >
            <FaCircleUser />
            <div className="conversation-block-infos">
                <div className="conversation-block-infos-line">
                    <h4>{conversation.title}</h4>

                    {conversation.last_message_time && (
                        <span>{format(conversation.last_message_time, 'HH:mm')}</span>
                    )}
                </div>

                {conversation.last_message_text && (
                    <p>
                        {conversation.type_conversation == true && conversation.last_message_sender_pk != pk_logged_member ? (
                            <>
                                <b>{conversation.last_message_sender}:</b> {conversation.last_message_text}
                            </>
                        ) : (conversation.last_message_text)}
                    </p>
                )}
            </div>
        </div>
    );
}

export default ConversationItem;