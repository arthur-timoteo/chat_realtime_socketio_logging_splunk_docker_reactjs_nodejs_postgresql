import { useEffect, useState } from 'react';
import './style.css';
import { api } from '../../services/axios';
import { FiSend } from "react-icons/fi";

type MessageSessionProps = {
    pkConversation: string | undefined,
    pkMember: string
}

interface Message {
    pk: string,
    fk_member: string,
    content_text: string,
    sent_at: string
}

function MessageSession({ pkConversation, pkMember } : MessageSessionProps) {
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        searchMessages();
    },[pkConversation]);

    async function searchMessages(){
        if (!pkConversation) {
            return;
        }

        try
        {
            await api.get(`/message/list/${pkConversation}`).then(response => setMessages(response.data));
        }
        catch {
            console.log('error');
        }
    }

    return (
        <div className="session-right">

            {pkConversation == undefined ? (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flex: '1'}}>
                    <h1>Start a chat</h1>
                </div>
            ) : (
                <>
                    {messages.length == 0 ? (
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flex: '1'}}>
                            <h1>No message sent in this chat</h1>
                        </div>
                    ) : (
                        <div className="message-session">
                            {messages.map(message => {
                                return (
                                    <div 
                                        key={message.pk}
                                        className={pkMember == message.fk_member ? 'message-sender' : 'message-recipient'}
                                    >
                                        <div className="message-item">
                                            <span className="message-text">{message.content_text}</span>
                                            <span className="message-date">{message.sent_at}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                    <div className="message-write">
                        <textarea id="comments" name="comments" />
                        <FiSend className="sent"/>
                    </div>
                </>
            )}
        </div>
    );
}

export default MessageSession;