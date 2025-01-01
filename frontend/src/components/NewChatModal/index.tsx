import { RiChatNewFill } from "react-icons/ri";

import './style.css';
import { useEffect, useState } from 'react';
import { api } from '../../services/axios';

interface ContactsModalProps {
    pkMember: string
}

interface Contact {
    pk: string,
    first_name: string
}

export function NewChatModal({ pkMember }: ContactsModalProps) {
    const [contacts, setContacts] = useState<Contact[]>([]);
    
    useEffect(() => {
        searchContacts();
    },[]);

    async function searchContacts(){
        try{
            console.log(pkMember);
            //await api.get(`/contact/list/conversation/${pkMember}`).then(response =>setContacts(response.data));
            await api.get(`/contact/list/conversation/${pkMember}`).then(response => console.log(response.data));
            
            console.log(contacts);
        }
        catch {
            //setMessageToUser({ style: 'danger', message: 'Error to try sign-up' });
        }
    }

    return (
        <div className="newchat-modal-area">
            {contacts.map(contact => {
                return (
                    <a className="newchat-modal-item" key={contact.pk}>
                        <span>{contact.first_name}</span>
                        <RiChatNewFill className="icon" />
                    </a>
                )
            })}
        </div>
    )
}