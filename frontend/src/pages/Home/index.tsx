import { useState } from 'react';
import { useLocation } from "react-router-dom";
import './style.css';

// Icons
import { FaAddressBook, FaCircleArrowLeft } from "react-icons/fa6";
import { RiChatNewFill } from "react-icons/ri";
import { MdGroupAdd } from "react-icons/md";

// Components
import { Modal } from '../../components/Modal/index';
import { ContactsModal } from '../../components/ContactsModal/index';
import { NewChatModal } from '../../components/NewChatModal/index';
import Conversation from '../../components/Conversation';
import MessageSession from '../../components/MessageSession';

function Home() {
    const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
    const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
    const [isChatModalOpen, setIsChatModalOpen] = useState(false);
    const [pkConversationIsShow, setPkConversationIsShow] = useState<string>();

    const location = useLocation();
    const pkMember = location.state?.pk;

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

    return (
        <div className="home-content">
            <div className="session-left">
                <div className="menu-bar">
                    <h3>Name</h3>
                    <div className="menu-items">

                        {isChatModalOpen && (
                            <Modal 
                                closeModal={closeChatModal}
                                title='NEW CHAT'
                            >
                                <NewChatModal
                                    pkMember={pkMember}
                                />
                            </Modal>
                        )}

                        {isAddGroupModalOpen && (
                            <Modal 
                                closeModal={closeAddGroupModal}
                                title='CREATE A GROUP'
                            >
                                oi
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

            <div>

            </div>
        </div>
    );
}

export default Home;