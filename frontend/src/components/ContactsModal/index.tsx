import { FaCircleUser, FaTrashCan } from "react-icons/fa6";
import './style.css';
import { useEffect, useState } from 'react';
import { api } from '../../services/axios';
import ShortUniqueId from 'short-uuid';
import { Log } from '../../services/logger';

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
            await Log('Error when trying to fetch member contacts', 'ERROR', 'CM-I-SC-0', 
                `data: {pkMember: ${pkMember}}, error: ${error as string}`);
        }
    }

    async function addContact(){
        if(!memberIdentifier){
            return;
        }

        try{
            await api.post('/contact/add', { 
                fk_member: pkMember,
                fk_member_contact: ShortUniqueId().toUUID(memberIdentifier) 
            });
            
            setMemberIdentifier('');
            searchContacts();
        }
        catch(error) {
            await Log('Error when trying to add contact', 'ERROR', 'CM-I-AC-0', 
                `data: {pkMember: ${pkMember}, pkContact: ${memberIdentifier}}, error: ${error as string}`);
        }
    }

    async function deleteContact(pk_member: string) {

        try{
            await api.delete(
                `/contact/${pk_member}`,
                {
                    headers: {
                        Authorization: pkMember
                    }
                }
            );
            
            searchContacts();
        }
        catch(error) {
            await Log('Error when trying to delete contact', 'ERROR', 'CM-I-DC-0', 
                `data: {pkMember: ${pkMember}, pkContact: ${pk_member}}, error: ${error as string}`);
        }
    };

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

                <button onClick={addContact} title="Add contact">ADD</button>
            </div>

            {contacts.length === 0 ? (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flex: '1'}}>
                    <p>You do not have any contact</p>
                </div>
            ) : (
                contacts.map(contact => {
                    return (
                        <div className="contacts-modal-item" key={contact.pk}>
                            <div className="contact-infos">
                                <FaCircleUser />
                                <span>{contact.first_name}</span>
                            </div>

                            <a title="Delete contact" onClick={() => deleteContact(contact.pk)}>
                                <FaTrashCan className="icon" />
                            </a>
                        </div>
                    )
                })
            )}
        </div>
    )
}