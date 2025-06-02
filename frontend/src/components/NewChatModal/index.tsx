import { RiChatNewFill } from "react-icons/ri";

import './style.css';
import { useEffect, useState } from 'react';
import { api } from '../../services/axios';

interface ContactsModalProps {
    pkMember: string,
    contactSelectedToNewChat: (pk_conversation: string) => void 
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
            console.log(error);
        }
    }

    async function createNewChat(pkContact: string) {
        try{
            const result = await api.post('/conversation/create', {
                type_conversation: 0, 
                title: null, 
                list_pk_member: [
                    pkMember,
                    pkContact
                ]
            });

            contactSelectedToNewChat(result.data.data.pk_conversation);
        }
        catch(error) {
            console.log(error);
        }
    }

    return (
        <div className="newchat-modal-area">
            {contacts.map(contact => {
                return (
                    <a 
                        className="newchat-modal-item" 
                        key={contact.pk} 
                        onClick={createNewChat.bind(null, contact.pk)}
                    >
                        <span>{contact.first_name}</span>
                        <RiChatNewFill className="icon" />
                    </a>
                )
            })}
        </div>
    )
}