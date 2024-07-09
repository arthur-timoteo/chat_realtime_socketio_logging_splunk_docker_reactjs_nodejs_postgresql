import './style.css';

// Icons
import { FaUserPlus } from "react-icons/fa6";
import { RiChatNewFill } from "react-icons/ri";
import { MdGroupAdd } from "react-icons/md";

// Components
import ConversationItem from "../../components/ConversationItem/index";

function Home() {
    return (
        <div className="home-content">
            <div className="session-left">
                <div className="menu-bar">
                    <h3>Name</h3>
                    <div className="menu-items">
                        <RiChatNewFill className="icon" />
                        <MdGroupAdd className="icon" />
                        <FaUserPlus className="icon" />
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