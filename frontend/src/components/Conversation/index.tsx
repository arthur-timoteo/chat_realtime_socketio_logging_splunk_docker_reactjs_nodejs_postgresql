import { useEffect, useState } from 'react';
import ConversationItem from '../ConversationItem';
import './style.css';
import { api } from '../../services/axios';

type ConversationProps = {
    pkMember: string,
    setPkConversationIsShow: (pkConversation: string) => void
}

interface Conversation {
    pk: string,
    title: string,
    last_message_sender: string | null,
    last_message_text: string | null
}

function Conversation({ pkMember, setPkConversationIsShow } : ConversationProps ) {
    const [conversations, setConversations] = useState<Conversation[]>([]);

    useEffect(() => {
        searchConversations();
    },[]);

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
            {conversations.map(conversation => {
                return (
                    <ConversationItem 
                        key={conversation.pk}
                        pk={conversation.pk}
                        title={conversation.title} 
                        time_last_message={null}
                        last_message={conversation.last_message_text} 
                        setPkConversationIsShow={setPkConversationIsShow}
                    />
                )
            })}
        </div>
    );
}

export default Conversation;