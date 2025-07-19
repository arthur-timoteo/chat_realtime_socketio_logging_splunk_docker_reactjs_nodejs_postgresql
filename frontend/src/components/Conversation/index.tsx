import { useEffect, useState, useRef } from 'react';
import ConversationItem from '../ConversationItem';
import './style.css';
import { api } from '../../services/axios';
import { useSocket } from '../../services/SocketContext';

type ConversationProps = {
    pkMember: string,
    setConversationIsShow: (conversation: ConversationActive) => void
}

interface Conversation {
    pk: string,
    title: string,
    last_message_sender: string | null,
    last_message_text: string | null
}

interface ConversationActive {
    pk: string;
    title: string | null;
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
                } else {
                    let indexFromConversation = prev.findIndex(c => c.pk === updatedConversation.pk);
                    prev.splice(indexFromConversation, 1);
                }

                conversationItem!.last_message_sender = updatedConversation.last_message_sender;
                conversationItem!.last_message_text = updatedConversation.last_message_text;

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
        catch {
            console.log('error');
        }
    }

    return (
        <div className="session-conversations">
            <div ref={conversationSessionEndRef} />
            
            {conversations.map(conversation => {
                return (
                    <ConversationItem 
                        key={conversation.pk}
                        pk={conversation.pk}
                        title={conversation.title} 
                        time_last_message={null}
                        last_message={conversation.last_message_text} 
                        setConversationIsShow={setConversationIsShow}
                    />
                )
            })}
        </div>
    );
}

export default Conversation;