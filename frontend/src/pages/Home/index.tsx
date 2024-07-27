import './style.css';

// Icons
import { FaAddressBook, FaCircleArrowLeft } from "react-icons/fa6";
import { RiChatNewFill } from "react-icons/ri";
import { MdGroupAdd } from "react-icons/md";

// Components
import ConversationItem from "../../components/ConversationItem/index";
import { useState } from 'react';

function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    function openModal(){
        setIsModalOpen(true);
    }
    
    function closeModal(){
        setIsModalOpen(false);
    }

    return (
        <div className="home-content">
            <div className="session-left">
                <div className="menu-bar">
                    <h3>Name</h3>
                    <div className="menu-items">

                        {isModalOpen && (
                            <div className="modal-fade">
                                <div className="modal">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <div className="modal-header-content-left">
                                                <FaCircleArrowLeft onClick={closeModal} className="icon" />
                                                <h1>Title</h1>
                                            </div>
                                            <FaCircleArrowLeft className="icon" />
                                        </div>
                                        <div className="modal-body">
                                            text text text text text
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <RiChatNewFill onClick={openModal} className="icon" />
                        <MdGroupAdd onClick={openModal} className="icon" />
                        <FaAddressBook onClick={openModal} className="icon" />
                    </div>
                </div>
                <div className="session-conversations">
                    <ConversationItem name="Name" time_last_message="00:00" last_message="Text text text text text" />
                    <hr/>
                    <ConversationItem name="Name" time_last_message="00:00" last_message="Text text text text text" />
                    <hr/>
                    <ConversationItem name="Name" time_last_message="00:00" last_message="Text text text text text" />
                    <hr/>
                    <ConversationItem name="Name" time_last_message="00:00" last_message="Text text text text text" />
                    <hr/>
                    <ConversationItem name="Name" time_last_message="00:00" last_message="Text text text text text" />
                    <hr/>
                    <ConversationItem name="Name" time_last_message="00:00" last_message="Text text text text text" />
                    <hr/>
                    <ConversationItem name="Name" time_last_message="00:00" last_message="Text text text text text" />
                    <hr/>
                    <ConversationItem name="Name" time_last_message="00:00" last_message="Text text text text text" />
                </div>
            </div>
            <div className="session-right">
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flex: '1'}}>
                    <h1 className="initial-text">Text text text text text text text</h1>
                </div>
            </div>
        </div>
    );
}

export default Home;