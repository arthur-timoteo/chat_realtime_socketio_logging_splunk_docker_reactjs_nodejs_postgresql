import { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import './style.css';

// Icons
import { FaAddressBook, FaPowerOff } from "react-icons/fa6";
import { RiChatNewFill } from "react-icons/ri";
import { MdGroupAdd } from "react-icons/md";

// Components
import { Modal } from '../../components/Modal/index';
import { ContactsModal } from '../../components/ContactsModal/index';
import { NewChatModal } from '../../components/NewChatModal/index';
import Conversation from '../../components/Conversation';
import MessageSession from '../../components/MessageSession';
import { GroupModal } from '../../components/GroupModal';

import { SocketProvider } from '../../services/SocketContext';

function Home() {
    const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
    const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    const [pkConversationIsShow, setPkConversationIsShow] = useState<string>();

    const location = useLocation();
    const pkMember = location.state?.pk;

    const navigate = useNavigate();

    function openContactsModal(){
        setIsContactsModalOpen(true);
    }
    
    function closeContactsModal(){
        setIsContactsModalOpen(false);
    }

    function openAddGroupModal(){
        setIsAddGroupModalOpen(true);
    }
    
    function closeAddGroupModal(){
        setIsAddGroupModalOpen(false);
    }
    
    function openChatModal(){
        setIsChatModalOpen(true);
    }
    
    function closeChatModal(){
        setIsChatModalOpen(false);
    }

    const handleContactSelectedToNewChat = (pk_conversation: string) => {
        closeChatModal();
        setPkConversationIsShow(pk_conversation);
    };
    
    const handleCreateGroup = (pk_conversation: string) => {
        closeAddGroupModal();
        setPkConversationIsShow(pk_conversation);
    };

    function signOut(){
        navigate('/');
    }

    return (
        <div className="home-content">
            <SocketProvider>
                <div className="session-left">
                    <div className="menu-bar">
                        <div className="menu-items">

                            {isChatModalOpen && (
                                <Modal 
                                    closeModal={closeChatModal}
                                    title='NEW CHAT'
                                >
                                    <NewChatModal
                                        pkMember={pkMember}
                                        contactSelectedToNewChat={handleContactSelectedToNewChat} 
                                    />
                                </Modal>
                            )}

                            {isAddGroupModalOpen && (
                                <Modal 
                                    closeModal={closeAddGroupModal}
                                    title='CREATE A GROUP'
                                >
                                    <GroupModal
                                        pkMember={pkMember}
                                        createGroup={handleCreateGroup}
                                    />
                                </Modal>
                            )}

                            {isContactsModalOpen && (
                                <Modal 
                                    closeModal={closeContactsModal}
                                    title='CONTACTS'
                                >
                                    <ContactsModal
                                        pkMember={pkMember}
                                    />
                                </Modal>
                            )}
                            
                            <RiChatNewFill onClick={openChatModal} className="icon" />
                            <MdGroupAdd onClick={openAddGroupModal} className="icon" />
                            <FaAddressBook onClick={openContactsModal} className="icon" />
                        </div>

                        <FaPowerOff className="icon" onClick={signOut} />
                    </div>

                    <Conversation
                        pkMember={pkMember}
                        setPkConversationIsShow={setPkConversationIsShow}
                    />
                    
                </div>
                
                <MessageSession
                    pkConversation={pkConversationIsShow}
                    pkMember={pkMember}
                />

            </SocketProvider>

            <div>

            </div>
        </div>
    );
}

export default Home;