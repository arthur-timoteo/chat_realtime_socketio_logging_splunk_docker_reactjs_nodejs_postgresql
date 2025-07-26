import { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import './style.css';

// Icons
import { FaAddressBook, FaCircleInfo, FaPowerOff } from "react-icons/fa6";
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
import { UserInfosModal } from '../../components/UserInfosModal';

interface ConversationActive {
    pk: string | undefined,
    title: string | undefined,
    isGroup: boolean | undefined
}

function Home() {
    const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
    const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    const [isUserInfosModalOpen, setIsUserInfosModalOpen] = useState(false);
    const [conversationIsShow, setConversationIsShow] = useState<ConversationActive>();

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
    
    function openUserInfosModal(){
        setIsUserInfosModalOpen(true);
    }
    
    function closeUserInfosModal(){
        setIsUserInfosModalOpen(false);
    }

    const handleContactSelectedToNewChat = (pk_conversation: string, contact_name: string) => {
        closeChatModal();
        setConversationIsShow({ pk: pk_conversation, title: contact_name, isGroup: false });
    };
    
    const handleCreateGroup = (pk_conversation: string, title: string) => {
        closeAddGroupModal();
        setConversationIsShow({ pk: pk_conversation, title, isGroup: true });
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
                            
                            {isUserInfosModalOpen && (
                                <Modal 
                                    closeModal={closeUserInfosModal}
                                    title='USER INFORMATIONS'
                                >
                                    <UserInfosModal
                                        pkMember={pkMember}
                                    />
                                </Modal>
                            )}
                            
                            <a title="Create a new chat" onClick={openChatModal}>
                                <RiChatNewFill className="icon" />
                            </a>
                            <a title="Create a new group" onClick={openAddGroupModal}>
                                <MdGroupAdd className="icon" />
                            </a>
                            <a title="Manage contacts" onClick={openContactsModal}>
                                <FaAddressBook className="icon" />
                            </a>
                        </div>

                        <div>
                            <a title="User Informations" onClick={openUserInfosModal}>
                                <FaCircleInfo className="icon" />
                            </a>

                            <a title="Sign Out" onClick={signOut}>
                                <FaPowerOff className="icon" />
                            </a>
                        </div>
                    </div>

                    <Conversation
                        pkMember={pkMember}
                        setConversationIsShow={setConversationIsShow}
                    />
                    
                </div>
                
                <MessageSession
                    conversation={conversationIsShow}
                    pkMember={pkMember}
                />

            </SocketProvider>

            <div>

            </div>
        </div>
    );
}

export default Home;