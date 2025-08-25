import './style.css';
import { useEffect, useState } from 'react';
import { api } from '../../services/axios';
import { FaCircleUser } from 'react-icons/fa6';
import { Log } from '../../services/logger';

interface GroupModalProps {
    pkMember: string,
    createGroup: (pk_conversation: string, title: string) => void 
}

interface Contact {
    pk: string,
    first_name: string
}

export function GroupModal({ pkMember, createGroup }: GroupModalProps) {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [titleGroup, setTitleGroup] = useState<string>('');
    const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
    
    useEffect(() =>{
        searchContacts();
    },[]);

    async function searchContacts(){
        try{
            await api.get(`/contact/list/${pkMember}`).then(response => setContacts(response.data));
        }
        catch(error) {
            await Log('Error when searching for member contacts', 'ERROR', 'GM-I-SC-0', 
                `data: {pkMember: ${pkMember}}, error: ${error as string}`);
        }
    }

    const handleCheckboxChange = (contact: Contact) => {
        setSelectedContacts((prevSelected) => {
            const isSelected = prevSelected.some((c) => c.pk === contact.pk);
            if (isSelected) {
                return prevSelected.filter((c) => c.pk !== contact.pk);
            } else {
                return [...prevSelected, contact];
            }
        });
    };

    const isSelected = (contact: Contact) => {
        return selectedContacts.some((c) => c.pk === contact.pk);
    };

    const handleRemove = (contact: Contact) => {
        setSelectedContacts((prevSelected) =>
            prevSelected.filter((c) => c.pk !== contact.pk)
        );
    };

    async function createGroupChat(){
        if(!titleGroup || selectedContacts.length === 0) {
            return;
        }

        try{
            const result = await api.post('/conversation/create', {
                type_conversation: 1, 
                title: titleGroup, 
                list_pk_member: [
                    pkMember,
                    ...selectedContacts.map(contact => contact.pk)
                ]
            });

            createGroup(result.data.data.pk_conversation, titleGroup);
        }
        catch(error) {
            await Log('Error when trying to create a group chat', 'ERROR', 'GM-I-CG-0', 
                `data: {pkMember: ${pkMember}}, error: ${error as string}`);
        }
    }

    return (
        <div className="group-modal-area">

            {contacts.length === 0 ? (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flex: '1'}}>
                    <p>You do not have any contact</p>
                </div>
            ) : (
                    <div className="group-modal-header">
                        <div>
                            <span>Title:</span> 

                            <input 
                                type="text"
                                name="title_conversation"
                                value={titleGroup}
                                onChange={ event => setTitleGroup(event.target.value) }
                            />
                        </div>
                        <div className="group-modal-header-selected-contacts">
                            {selectedContacts.map((contact) => (
                                <span key={contact.pk} style={{ marginRight: '10px' }}>
                                    <FaCircleUser />
                                    {contact.first_name}
                                    <button onClick={() => handleRemove(contact)}> X </button>
                                </span>
                            ))}
                        </div>
                        <button onClick={createGroupChat}>CREATE GROUP</button>
                    </div>
            )}

            {contacts.map(contact => {
                return (
                    <div className="group-modal-item" key={contact.pk}>
                        <div className="contact-infos">
                            <FaCircleUser />
                            <span>{contact.first_name}</span>
                        </div>

                        <input 
                            type="checkbox"
                            name="add_in_conversation"
                            checked={isSelected(contact)}
                            onChange={() => handleCheckboxChange(contact)}
                        />
                    </div>
                )
            })}
        </div>
    )
}