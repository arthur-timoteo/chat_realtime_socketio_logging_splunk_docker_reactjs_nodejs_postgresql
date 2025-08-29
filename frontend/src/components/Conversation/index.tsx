import { useEffect, useState,useRef } from 'react';
import ConversationItem from '../ConversationItem';
import './style.css';
import { api } from '../../services/axios';
import { useSocket } from '../../services/SocketContext';
import { Log } from '../../services/logger';

type ConversationProps = {
    pkMember: string,
    setConversationIsShow: (conversation: ConversationActive) => void
}

interface Conversation {
    pk: string,
    title: string,
    last_message_sender_pk: string,
    last_message_sender: string,
    last_message_text: string,
    last_message_time: string,
    type_conversation: boolean
}

interface ConversationActive {
    pk: string | undefined,
    title: string | undefined,
    isGroup: boolean | undefined
}

function Conversation({ pkMember, setConversationIsShow } : ConversationProps ) {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const socket = useSocket();
    const conversationSessionEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        searchConversations();

        // Listen for updates from any user conversation
        socket?.on(`conversation:update:${pkMember}`, (updatedConversation) => {
            setConversations((prev) => {
                let conversationItem = prev.find(c => c.pk === updatedConversation.pk);

                if (!conversationItem) {
                    conversationItem = {} as Conversation;
                    conversationItem.pk = updatedConversation.pk;
                    conversationItem.title = updatedConversation.title;
                    conversationItem.type_conversation = updatedConversation.type_conversation;
                } else {
                    let indexFromConversation = prev.findIndex(c => c.pk === updatedConversation.pk);
                    prev.splice(indexFromConversation, 1);
                }

                conversationItem.last_message_sender_pk = updatedConversation.last_message_sender_pk;
                conversationItem.last_message_sender = updatedConversation.last_message_sender;
                conversationItem.last_message_time = updatedConversation.last_message_time;
                conversationItem.last_message_text = updatedConversation.last_message_text;

                return [conversationItem!, ...prev];
            });
        });

        return () => {
            socket?.off(`conversation:update${pkMember}`);
        };
    },[socket]);

    useEffect(() => {
        conversationSessionEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversations]);

    async function searchConversations(){
        try
        {
            await api.get(`/conversation/list/${pkMember}`).then(response => setConversations(response.data));
        }
        catch(error) {
            await Log('Error when trying to fetch member conversations', 'ERROR', 'C-I-SC-0', 
                `data: {pkMember: ${pkMember}}, error: ${error as string}`);
        }
    }

    return (
        <div className="session-conversations">
            <div ref={conversationSessionEndRef} />
            
            {conversations.map(conversation => {
                return (
                    <ConversationItem 
                        key={conversation.pk}
                        pk_logged_member={pkMember}
                        conversation={conversation}
                        setConversationIsShow={setConversationIsShow}
                    />
                )
            })}
        </div>
    );
}

export default Conversation;