import { RiChatNewFill } from "react-icons/ri";

import './style.css';
import { useEffect, useState } from 'react';
import { api } from '../../services/axios';
import { Log } from '../../services/logger';

interface ContactsModalProps {
    pkMember: string,
    contactSelectedToNewChat: (pk_conversation: string, contact_name: string) => void 
}

interface Contact {
    pk: string,
    first_name: string
}

export function NewChatModal({ pkMember, contactSelectedToNewChat }: ContactsModalProps) {
    const [contacts, setContacts] = useState<Contact[]>([]);
    
    useEffect(() => {
        searchContacts();
    },[]);

    async function searchContacts(){
        try{
            await api.get(`/contact/list/conversation/${pkMember}`).then(response =>setContacts(response.data));
        }
        catch(error) {
            await Log('Error when searching for member contacts', 'ERROR', 'NCM-I-SC-0', 
                `data: {pkMember: ${pkMember}}, error: ${error as string}`);
        }
    }

    async function createNewChat(pkContact: string, contactName: string) {
        try{
            const result = await api.post('/conversation/create', {
                type_conversation: 0, 
                title: null, 
                list_pk_member: [
                    pkMember,
                    pkContact
                ]
            });

            contactSelectedToNewChat(result.data.data.pk_conversation, contactName);
        }
        catch(error) {
            await Log('Error when trying to create new chat', 'ERROR', 'NCM-I-CNC-0', 
                `data: {pkMember: ${pkMember}, pkContact: ${pkContact}}, error: ${error as string}`);
        }
    }

    return (
        <div className="newchat-modal-area">
            {contacts.length === 0 ? (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flex: '1'}}>
                    <p>You already have a chat with all your contacts</p>
                </div>
            ) : (
                contacts.map(contact => {
                    return (
                        <a 
                            className="newchat-modal-item" 
                            key={contact.pk} 
                            onClick={createNewChat.bind(null, contact.pk, contact.first_name)}
                        >
                            <span>{contact.first_name}</span>
                            <RiChatNewFill className="icon" />
                        </a>
                    )
                })
            )}
        </div>
    )
}