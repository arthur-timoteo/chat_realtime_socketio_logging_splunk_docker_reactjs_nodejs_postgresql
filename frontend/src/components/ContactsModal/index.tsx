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
    const [memberIdentifier, setMemberIdentifier] = useState<string>('');
    
    useEffect(() => {
        searchContacts();
    },[]);

    async function searchContacts(){
        try{
            await api.get(`/contact/list/${pkMember}`).then(response => setContacts(response.data));
        }
        catch(error) {
            console.log(error);
        }
    }

    async function addContact(){
        if(!memberIdentifier){
            return;
        }

        try{
            await api.post('/contact/add', { 
                    fk_member: pkMember,
                    fk_member_contact: memberIdentifier 
                });
            setMemberIdentifier('');
            searchContacts();
        }
        catch(error) {
            console.log(error);
        }
    }

    return (
        <div className="contacts-modal-area">
            <div className="contacts-modal-header">
                <div>
                    <span>Code Contact:</span> 

                    <input 
                        type="text"
                        name="member_identifier"
                        value={memberIdentifier}
                        onChange={ event => setMemberIdentifier(event.target.value) }
                    />
                </div>

                <button onClick={addContact}>ADD</button>
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