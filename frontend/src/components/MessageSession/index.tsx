import { useEffect, useRef, useState } from 'react';
import './style.css';
import { api } from '../../services/axios';
import { FiSend } from "react-icons/fi";
import { format } from 'date-fns';
import { useSocket } from '../../services/SocketContext';
import { FaCircleUser } from 'react-icons/fa6';
import { Log } from '../../services/logger';

type MessageSessionProps = {
    conversation: ConversationActive | undefined,
    pkMember: string
}

interface Message {
    pk: string,
    fk_member: string,
    content_text: string,
    sent_at: string,
    first_name: string
}

interface ConversationActive {
    pk: string | undefined,
    title: string | undefined,
    isGroup: boolean | undefined
}

function MessageSession({ conversation, pkMember } : MessageSessionProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState('');
    const socket = useSocket();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        searchMessages();

        if (conversation) {
            if(conversation.pk){
                // Connects the user in the conversation room
                socket?.emit('joinRoom', conversation.pk);

                // Listen for incoming messages
                socket?.on('receiveMessage', (msg: Message) => {
                    setMessages((prev) => [...prev, msg]);
                });

                return () => {
                    socket?.off('receiveMessage');
                };
            }
        }
        
    },[socket, conversation]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    async function searchMessages(){
        if (!conversation) {
            return;
        }

        try
        {
            await api.get(`/message/list/${conversation.pk}`).then(response => setMessages(response.data));
        }
        catch(error) {
            await Log('Error when searching for member contacts', 'ERROR', 'MS-I-SM-0', 
                `data: {pkMember: ${pkMember}, conversation: ${conversation}}, error: ${error as string}`);
        }
    }
    
    async function sendMessage(){
        if (!message.trim()) {
            return;
        }

        try
        {
            const messageFormated = {
                fk_member: pkMember,
                content_text: message,
                title: conversation?.title || null,
                sent_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
            };
            
            let pkConversation = conversation!.pk;
            socket?.emit('sendMessage', { pkConversation , messageFormated });
            setMessage('');
        }
        catch(error) {
            await Log('Error when searching for member contacts', 'ERROR', 'MS-I-SDM-0', 
                `data: {pkMember: ${pkMember}, conversation: ${conversation}}, error: ${error as string}`);
        }
    }

    return (
        <div className="session-right">

            {conversation == undefined ? (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flex: '1'}}>
                    <h1>Start a chat</h1>
                </div>
            ) : (
                <>
                    <div className="session-title">
                        <a>
                            <div className="conversation-infos">
                                <FaCircleUser className="conversation-img" />
                                <span className="conversation-title">{conversation.title}</span>
                            </div>
                        </a>
                    </div>
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
                                            { conversation!.isGroup && (
                                                <span className='message-name-sender'>{pkMember != message.fk_member && message.first_name}</span>
                                            ) }
                                            <span className="message-text">{message.content_text}</span>
                                            <span className="message-date">
                                                <span>{format(message.sent_at, 'HH:mm')}</span>
                                                <span>{format(message.sent_at, 'dd/MM/yyyy')}</span>
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                            
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                    <div className="message-write">
                        <textarea 
                            id="comments" 
                            name="comments"
                            value={message}
                            onChange={event => setMessage(event.target.value)} />
                        <a
                            title="Send message"
                            onClick={sendMessage}>
                            <FiSend className="sent"/>
                        </a>
                    </div>
                </>
            )}
        </div>
    );
}

export default MessageSession;