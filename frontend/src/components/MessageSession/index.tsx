import { useEffect, useState } from 'react';
import './style.css';
import { api } from '../../services/axios';
import { FiSend } from "react-icons/fi";
import { format } from 'date-fns';
import { useSocket } from '../../services/SocketContext';

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
    const [message, setMessage] = useState('');
    const socket = useSocket();

    useEffect(() => {
        searchMessages();

        // Connects the user in the conversation room
        socket?.emit('joinRoom', pkConversation);

        // Listen for incoming messages
        socket?.on('receiveMessage', (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket?.off('receiveMessage');
        };
    },[socket, pkConversation]);

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
    
    async function sendMessage(){
        if (!message.trim()) {
            return;
        }

        try
        {
            const messageFormated = {
                pk: '',
                fk_member: pkMember,
                content_text: message,
                sent_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
            };
            
            socket?.emit('sendMessage', { pkConversation, messageFormated });
            setMessage('');
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
                                            <span className="message-date">
                                                <span>{format(message.sent_at, 'HH:mm')}</span>
                                                <span>{format(message.sent_at, 'dd/MM/yyyy')}</span>
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                    <div className="message-write">
                        <textarea 
                            id="comments" 
                            name="comments"
                            value={message}
                            onChange={event => setMessage(event.target.value)} />
                        <FiSend className="sent" onClick={sendMessage}/>
                    </div>
                </>
            )}
        </div>
    );
}

export default MessageSession;