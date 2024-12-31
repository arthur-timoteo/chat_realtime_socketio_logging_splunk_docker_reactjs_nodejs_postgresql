import { FaTrashCan } from "react-icons/fa6";

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

export function ContactsModal({ pkMember }: ContactsModalProps) {
    const [contacts, setContacts] = useState<Contact[]>([]);
    
    useEffect(() => {
        searchContacts();
    },[]);

    async function searchContacts(){
        try{
            await api.get(`/contact/list/${pkMember}`).then(response => setContacts(response.data));
        }
        catch {
            //setMessageToUser({ style: 'danger', message: 'Error to try sign-up' });
        }
    }

    return (
        <div className="contacts-modal-area">
            <div className="contacts-modal-header">
                <input type="text" name="email_contact" />
                <button>ADD</button>
            </div>
            {contacts.map(contact => {
                return (
                    <div className="contacts-modal-item" key={contact.pk}>
                        <span>{contact.first_name}</span>
                        <FaTrashCan className="icon" />
                    </div>
                )
            })}
        </div>
    )
}