import { useContext } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { ChatContext } from '../../context/ChatContext'

const HomePage = () => {
    const Chatcontext = useContext(ChatContext);
    if (!Chatcontext) throw new Error("ChatContext is missing. Make sure App is wrapped in AuthProvider.");
    const { selectedUser, selectRightSidebar } = Chatcontext;

    return (
        <div className="w-full h-screen overflow-hidden bg-black flex items-center justify-center">
            <div
                className={`w-[94%] sm:w-[88%] h-[95vh] sm:h-[94vh] backdrop-blur-xl bg-black/70 border border-[#2f2d2d] rounded-md overflow-hidden grid grid-cols-1 relative
                ${selectRightSidebar
                    ? selectedUser
                        ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]'
                        : 'md:grid-cols-2'
                    : selectedUser
                        ? 'md:grid-cols-[1fr_1.5fr] xl:grid-cols-[1fr_2fr]'
                        : 'md:grid-cols-[1fr_1.4fr]'
                }`}
            >
                <Sidebar />
                <ChatContainer />
                {selectRightSidebar && <RightSidebar />}
            </div>
        </div>
    )
}

export default HomePage;